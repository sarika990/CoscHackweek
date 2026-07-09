import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import CapsuleCard from '../components/CapsuleCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { PlusCircle, Search, HelpCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [capsules, setCapsules] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [visibility, setVisibility] = useState('All');
  const [sort, setSort] = useState('Newest');

  // Tab state managed via Sidebar
  const [activeTab, setActiveTab] = useState('all');

  // Deletion Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [capsuleToDelete, setCapsuleToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch user capsules & stats
  const fetchCapsules = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (visibility !== 'All') params.visibility = visibility;
      if (sort) params.sort = sort;

      // Handle tab conversions
      if (activeTab === 'locked') params.status = 'Locked';
      else if (activeTab === 'unlocked') params.status = 'Unlocked';

      const { data } = await API.get('/capsules', { params });

      let resultCapsules = data.capsules;
      if (activeTab === 'favorites') {
        resultCapsules = resultCapsules.filter(c => c.isFavorite);
      }

      setCapsules(resultCapsules);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching capsules:', error);
      toast.error('Failed to retrieve time capsules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapsules();
  }, [search, category, status, visibility, sort, activeTab]);

  // Handle live status changes (countdown expires)
  const handleUpdateStatus = (capsuleId) => {
    // Re-fetch capsules to sync client/server dates and statuses
    fetchCapsules();
  };

  // Toggle Favorite
  const handleFavoriteToggle = async (capsuleId) => {
    try {
      const { data } = await API.put(`/capsules/${capsuleId}/favorite`);
      toast.success(data.message);
      // Local state update
      setCapsules(prev =>
        prev.map(c => (c._id === capsuleId ? { ...c, isFavorite: data.isFavorite } : c))
      );
    } catch (error) {
      toast.error('Failed to toggle favorite status');
    }
  };

  // Open Delete Modal
  const openDeleteModal = (capsuleId) => {
    setCapsuleToDelete(capsuleId);
    setDeleteModalOpen(true);
  };

  // Execute Deletion
  const handleDeleteCapsule = async () => {
    if (!capsuleToDelete) return;
    try {
      setDeleteLoading(true);
      await API.delete(`/capsules/${capsuleToDelete}`);
      toast.success('Time capsule deleted successfully');
      setDeleteModalOpen(false);
      setCapsuleToDelete(null);
      fetchCapsules();
    } catch (error) {
      toast.error('Failed to delete time capsule');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome & Stats Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Memory Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Your preserved letters, thoughts, and files sent forward in time.
            </p>
          </div>
          <button
            onClick={() => navigate('/create')}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 self-start md:self-auto"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create Capsule</span>
          </button>
        </div>

        {/* Stats Grid Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Memories', value: stats.total, color: 'border-slate-100 dark:border-slate-800' },
              { label: 'Locked Capsules', value: stats.locked, color: 'border-rose-100 dark:border-rose-950/20 text-rose-500' },
              { label: 'Unlocked Memories', value: stats.unlocked, color: 'border-emerald-100 dark:border-emerald-950/20 text-emerald-500' },
              { label: 'Private', value: stats.private, color: 'border-indigo-100 dark:border-indigo-950/20 text-indigo-500' },
              { label: 'Public Feed Shared', value: stats.public, color: 'border-amber-100 dark:border-amber-950/20 text-amber-500' },
            ].map((st, i) => (
              <div key={i} className={`bg-white dark:bg-slate-900 border ${st.color} rounded-2xl p-4 shadow-sm text-center`}>
                <span className="text-2xl font-extrabold block text-slate-800 dark:text-white">{st.value}</span>
                <span className="text-xs text-slate-400 font-semibold">{st.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Navigation Tabs */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} />

          {/* Right Content Stream */}
          <div className="flex-grow space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <SearchBar value={search} onChange={setSearch} placeholder="Search capsules..." />
            </div>

            <FilterBar
              category={category}
              setCategory={setCategory}
              status={status}
              setStatus={setStatus}
              visibility={visibility}
              setVisibility={setVisibility}
              sort={sort}
              setSort={setSort}
            />

            {/* Grid List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 h-[350px] animate-pulse space-y-6">
                    <div className="flex justify-between">
                      <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                      <div className="h-6 w-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                    <div className="h-16 w-full bg-slate-100 dark:bg-slate-850 rounded-2xl" />
                  </div>
                ))}
              </div>
            ) : capsules.length === 0 ? (
              <EmptyState
                title={search || category !== 'All' ? 'No filter results' : 'No memories locked'}
                description={
                  search || category !== 'All'
                    ? 'Try clearing search terms or selecting another category filter.'
                    : 'Get started by sealing away your messages and attachments.'
                }
                actionLabel={search || category !== 'All' ? null : 'Lock First Capsule'}
                onAction={() => navigate('/create')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {capsules.map((capsule) => (
                  <CapsuleCard
                    key={capsule._id}
                    capsule={capsule}
                    onUpdateStatus={handleUpdateStatus}
                    onFavoriteToggle={handleFavoriteToggle}
                    onDelete={openDeleteModal}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Capsule">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-rose-500 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-4 rounded-2xl">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <p className="text-sm font-semibold">
              Warning: This action cannot be undone. All files, messages, and memories inside this capsule will be permanently deleted.
            </p>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Are you absolutely sure you want to delete this time capsule?
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold rounded-xl text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteCapsule}
              disabled={deleteLoading}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-rose-500/20 transition-all flex items-center gap-2"
            >
              {deleteLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              <span>Delete Permanently</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
