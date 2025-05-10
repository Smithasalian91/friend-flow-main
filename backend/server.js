
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('FriendFlow API is running');
});

// Connect to MongoDB (in a real app)
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
