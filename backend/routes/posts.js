
const router = require('express').Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('creator', 'username profileImage')
      .populate('comments.creator', 'username profileImage');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new post
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, image, tags } = req.body;
    
    // Validate input
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    const newPost = new Post({
      title,
      description,
      image,
      tags,
      creator: req.user.id
    });
    
    await newPost.save();
    
    await newPost.populate('creator', 'username profileImage');
    
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('creator', 'username profileImage')
      .populate('comments.creator', 'username profileImage');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a post
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, image, tags } = req.body;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is the creator of the post
    if (post.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this post' });
    }
    
    // Update post
    post.title = title || post.title;
    post.description = description || post.description;
    post.image = image || post.image;
    post.tags = tags || post.tags;
    
    await post.save();
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is the creator of the post
    if (post.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this post' });
    }
    
    await post.remove();
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like/Unlike a post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if post already liked by user
    const isLiked = post.likes.includes(req.user.id);
    
    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(like => like.toString() !== req.user.id);
    } else {
      // Like
      post.likes.push(req.user.id);
    }
    
    await post.save();
    
    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const newComment = {
      text,
      creator: req.user.id
    };
    
    post.comments.push(newComment);
    
    await post.save();
    
    await post.populate('comments.creator', 'username profileImage');
    
    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
