
const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Get a user profile
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate('followers', 'username profileImage')
      .populate('following', 'username profileImage');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's posts
    const posts = await Post.find({ creator: user._id })
      .sort({ createdAt: -1 })
      .populate('creator', 'username profileImage')
      .populate('comments.creator', 'username profileImage');
    
    res.json({ user, posts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { bio, profileImage } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields
    if (bio !== undefined) user.bio = bio;
    if (profileImage) user.profileImage = profileImage;
    
    await user.save();
    
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Follow a user
router.post('/follow/:id', auth, async (req, res) => {
  try {
    // Check if IDs are the same
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }
    
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);
    
    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already following
    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: 'Already following this user' });
    }
    
    // Add to following
    currentUser.following.push(req.params.id);
    await currentUser.save();
    
    // Add to followers
    userToFollow.followers.push(req.user.id);
    await userToFollow.save();
    
    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Unfollow a user
router.post('/unfollow/:id', auth, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);
    
    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if not following
    if (!currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: 'Not following this user' });
    }
    
    // Remove from following
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== req.params.id
    );
    await currentUser.save();
    
    // Remove from followers
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== req.user.id
    );
    await userToUnfollow.save();
    
    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
