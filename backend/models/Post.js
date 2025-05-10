
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  image: {
    type: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [CommentSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);
