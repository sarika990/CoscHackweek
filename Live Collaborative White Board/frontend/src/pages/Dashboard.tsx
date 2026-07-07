
import { Navbar } from '../components/Navbar';
import { Toolbar } from '../components/Toolbar';
import { PropertiesPanel } from '../components/PropertiesPanel';
import { CanvasArea } from '../components/CanvasArea';

export const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white text-gray-800">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        <CanvasArea />
        <PropertiesPanel />
      </div>
    </div>
  );
};