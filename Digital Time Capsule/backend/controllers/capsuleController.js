import Capsule from '../models/capsuleModel.js';
import fs from 'fs';

// Helper to check lock status
const isLocked = (unlockDate) => {
  return new Date(unlockDate) > new Date();
};

// Helper to delete physical files
const deleteFiles = (filesArray) => {
  filesArray.forEach((filePath) => {
    if (filePath && fs.existsSync(`./${filePath}`)) {
      try {
        fs.unlinkSync(`./${filePath}`);
      } catch (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
      }
    }
  });
};

// @desc    Create new Capsule
// @route   POST /api/capsules
// @access  Private
export const createCapsule = async (req, res, next) => {
  try {
    const { title, description, message, unlockDate, visibility, category, tags } = req.body;

    if (!title || !message || !unlockDate) {
      res.status(400);
      return next(new Error('Title, message, and unlock date are required'));
    }

    const parsedTags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean)) : [];

    // Extract uploaded files
    const images = req.files && req.files.images ? req.files.images.map(f => f.path.replace(/\\/g, '/')) : [];
    const video = req.files && req.files.video ? req.files.video[0].path.replace(/\\/g, '/') : '';
    const pdf = req.files && req.files.pdf ? req.files.pdf[0].path.replace(/\\/g, '/') : '';

    const capsule = await Capsule.create({
      title,
      description: description || '',
      message,
      images,
      video,
      pdf,
      unlockDate,
      visibility: visibility || 'private',
      category: category || 'Personal',
      tags: parsedTags,
      createdBy: req.user._id,
    });

    res.status(201).json(capsule);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all capsules created by user with search/filter/sort
// @route   GET /api/capsules
// @access  Private
export const getMyCapsules = async (req, res, next) => {
  try {
    const { search, category, status, visibility, sort } = req.query;

    let query = { createdBy: req.user._id };

    // Search query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Visibility filter
    if (visibility && visibility !== 'All') {
      query.visibility = visibility;
    }

    let capsules = await Capsule.find(query);

    // Filter by Lock Status in JS (since it depends on Date.now())
    if (status && status !== 'All') {
      const now = new Date();
      if (status === 'Locked') {
        capsules = capsules.filter(c => new Date(c.unlockDate) > now);
      } else if (status === 'Unlocked') {
        capsules = capsules.filter(c => new Date(c.unlockDate) <= now);
      }
    }

    // Sort capsules
    if (sort) {
      if (sort === 'Newest') {
        capsules.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sort === 'Oldest') {
        capsules.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sort === 'Unlock Date') {
        capsules.sort((a, b) => new Date(a.unlockDate) - new Date(b.unlockDate));
      } else if (sort === 'Title A-Z') {
        capsules.sort((a, b) => a.title.localeCompare(b.title));
      }
    } else {
      // Default sort
      capsules.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Calculate Statistics for current user
    const allUserCapsules = await Capsule.find({ createdBy: req.user._id });
    const now = new Date();
    const stats = {
      total: allUserCapsules.length,
      locked: allUserCapsules.filter(c => new Date(c.unlockDate) > now).length,
      unlocked: allUserCapsules.filter(c => new Date(c.unlockDate) <= now).length,
      private: allUserCapsules.filter(c => c.visibility === 'private').length,
      public: allUserCapsules.filter(c => c.visibility === 'public').length,
    };

    res.json({ capsules, stats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Single Capsule
// @route   GET /api/capsules/:id
// @access  Private/Public (Conditional)
export const getCapsuleById = async (req, res, next) => {
  try {
    const capsule = await Capsule.findById(req.id || req.params.id).populate('createdBy', 'name email profileImage');

    if (!capsule) {
      res.status(404);
      return next(new Error('Capsule not found'));
    }

    const isOwner = req.user && req.user._id.toString() === capsule.createdBy._id.toString();
    const isPublic = capsule.visibility === 'public';

    if (!isOwner && !isPublic) {
      res.status(403);
      return next(new Error('Access Denied: Private Capsule'));
    }

    const locked = isLocked(capsule.unlockDate);

    // If locked and user is NOT the owner (or even if they are, show locked screen details)
    if (locked) {
      // Return safe metadata, strip away messages and files
      return res.json({
        _id: capsule._id,
        title: capsule.title,
        description: capsule.description,
        unlockDate: capsule.unlockDate,
        visibility: capsule.visibility,
        category: capsule.category,
        tags: capsule.tags,
        createdBy: capsule.createdBy,
        isFavorite: req.user ? capsule.favorites.includes(req.user._id) : false,
        favoritesCount: capsule.favorites.length,
        locked: true,
      });
    }

    // Unlocked: Return full info
    res.json({
      _id: capsule._id,
      title: capsule.title,
      description: capsule.description,
      message: capsule.message,
      images: capsule.images,
      video: capsule.video,
      pdf: capsule.pdf,
      unlockDate: capsule.unlockDate,
      visibility: capsule.visibility,
      category: capsule.category,
      tags: capsule.tags,
      createdBy: capsule.createdBy,
      isFavorite: req.user ? capsule.favorites.includes(req.user._id) : false,
      favoritesCount: capsule.favorites.length,
      locked: false,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Capsule
// @route   PUT /api/capsules/:id
// @access  Private
export const updateCapsule = async (req, res, next) => {
  try {
    const capsule = await Capsule.findById(req.params.id);

    if (!capsule) {
      res.status(404);
      return next(new Error('Capsule not found'));
    }

    if (capsule.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to update this capsule'));
    }

    // Check if capsule is already unlocked
    if (!isLocked(capsule.unlockDate)) {
      res.status(400);
      return next(new Error('Cannot update capsule after it has been unlocked'));
    }

    const { title, description, message, unlockDate, visibility, category, tags, keepExistingFiles } = req.body;

    capsule.title = title || capsule.title;
    capsule.description = description !== undefined ? description : capsule.description;
    capsule.message = message || capsule.message;
    capsule.unlockDate = unlockDate || capsule.unlockDate;
    capsule.visibility = visibility || capsule.visibility;
    capsule.category = category || capsule.category;

    if (tags) {
      capsule.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    // Handle new uploads if any
    const newImages = req.files && req.files.images ? req.files.images.map(f => f.path.replace(/\\/g, '/')) : [];
    const newVideo = req.files && req.files.video ? req.files.video[0].path.replace(/\\/g, '/') : '';
    const newPdf = req.files && req.files.pdf ? req.files.pdf[0].path.replace(/\\/g, '/') : '';

    // If files are changing and we're not keeping old ones, delete them
    if (keepExistingFiles !== 'true') {
      if (newImages.length > 0) {
        deleteFiles(capsule.images);
        capsule.images = newImages;
      }
      if (newVideo) {
        deleteFiles([capsule.video]);
        capsule.video = newVideo;
      }
      if (newPdf) {
        deleteFiles([capsule.pdf]);
        capsule.pdf = newPdf;
      }
    } else {
      if (newImages.length > 0) {
        capsule.images = [...capsule.images, ...newImages];
      }
      if (newVideo) {
        if (capsule.video) deleteFiles([capsule.video]);
        capsule.video = newVideo;
      }
      if (newPdf) {
        if (capsule.pdf) deleteFiles([capsule.pdf]);
        capsule.pdf = newPdf;
      }
    }

    const updatedCapsule = await capsule.save();
    res.json(updatedCapsule);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Capsule
// @route   DELETE /api/capsules/:id
// @access  Private
export const deleteCapsule = async (req, res, next) => {
  try {
    const capsule = await Capsule.findById(req.params.id);

    if (!capsule) {
      res.status(404);
      return next(new Error('Capsule not found'));
    }

    if (capsule.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to delete this capsule'));
    }

    // Delete attached files
    deleteFiles([...capsule.images, capsule.video, capsule.pdf]);

    await capsule.deleteOne();

    res.json({ message: 'Capsule deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public unlocked capsules
// @route   GET /api/capsules/public
// @access  Public
export const getPublicCapsules = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 9 } = req.query;
    const now = new Date();

    let query = {
      visibility: 'public',
      unlockDate: { $lte: now },
    };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const skipIndex = (page - 1) * limit;
    const total = await Capsule.countDocuments(query);
    const capsules = await Capsule.find(query)
      .populate('createdBy', 'name profileImage')
      .sort({ unlockDate: -1 })
      .skip(skipIndex)
      .limit(Number(limit));

    res.json({
      capsules,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Favorite status of capsule
// @route   PUT /api/capsules/:id/favorite
// @access  Private
export const toggleFavorite = async (req, res, next) => {
  try {
    const capsule = await Capsule.findById(req.params.id);

    if (!capsule) {
      res.status(404);
      return next(new Error('Capsule not found'));
    }

    const isFav = capsule.favorites.includes(req.user._id);

    if (isFav) {
      capsule.favorites = capsule.favorites.filter(id => id.toString() !== req.user._id.toString());
    } else {
      capsule.favorites.push(req.user._id);
    }

    await capsule.save();
    res.json({
      message: isFav ? 'Removed from favorites' : 'Added to favorites',
      isFavorite: !isFav,
    });
  } catch (error) {
    next(error);
  }
};
