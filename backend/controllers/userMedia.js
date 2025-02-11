const Media = require('../models/userMedia');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + path.extname(file.originalname));
  }
});

// File Type Filter (Only Images/Videos)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter });

exports.savedMediaFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { userId } = req.body; 

    const newMedia = new Media({
      userId,
      fileUrl: `/uploads/${req.file.filename}`, 
      fileType: req.file.mimetype.startsWith("image/") ? "image" : "video",
    });

    await newMedia.save();
    res.status(201).json({ message: "Media uploaded successfully", media: newMedia });

  } catch (error) {
    console.error("Error saving media file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Media Files for a Specific User
exports.getMediaFile = async (req, res) => {
  try {
    if (req.params.userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access forbidden' });
    }

    const mediaFiles = await Media.find({ userId: req.params.userId }).sort({ createdAt: -1 });

    res.status(200).json(mediaFiles);
  } catch (error) {
    console.error('Error fetching media files:', error);
    res.status(500).json({ error: 'Error fetching media files' });
  }
};

// Delete Media File
exports.deleteMediaFile = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Ensure correct file path
    const filePath = path.join(__dirname, '../', media.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: 'Media file deleted successfully' });
  } catch (error) {
    console.error('Error deleting media file:', error);
    res.status(500).json({ error: 'Error deleting media file' });
  }
};

// Middleware to Use in Routes
exports.uploadMedia = upload.single('file');
