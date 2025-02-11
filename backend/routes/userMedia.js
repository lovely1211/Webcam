const express = require('express');
const router = express.Router();
const { savedMediaFile, getMediaFile, deleteMediaFile, uploadMedia } = require('../controllers/userMedia');
const authMiddleware = require('../middleware/authMiddleware'); 

router.post('/upload', authMiddleware, uploadMedia, savedMediaFile);
router.get('/:userId', authMiddleware, getMediaFile);
router.delete('/:id', authMiddleware, deleteMediaFile);

module.exports = router;
