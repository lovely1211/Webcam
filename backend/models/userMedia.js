const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
  },
  { timestamps: true } 
);

const Media = mongoose.model('Media', mediaSchema);
module.exports = Media;
