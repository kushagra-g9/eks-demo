// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors middleware
require('dotenv').config(); // Load environment variables from .env file

const Item = require('./models/Item'); // Import the Item model

const app = express();
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,      // Use the new URL parser
  useUnifiedTopology: true,   // Use the new server discovery and monitoring engine
})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

// API Routes

// GET all items
app.get('/api/items', async (req, res) => {
  try {
    // Find all items in the database and sort them by date in descending order
    const items = await Item.find().sort({ date: -1 });
    res.json(items); // Send the items as a JSON response
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ message: 'Server error' }); // Send a 500 status for server errors
  }
});

// POST a new item
app.post('/api/items', async (req, res) => {
  const { name, description } = req.body; // Destructure name and description from request body

  // Basic validation
  if (!name) {
    return res.status(400).json({ message: 'Item name is required' });
  }

  try {
    // Create a new Item instance with data from the request body
    const newItem = new Item({
      name,
      description,
    });

    // Save the new item to the database
    const item = await newItem.save();
    res.status(201).json(item); // Send the created item with a 201 status code
  } catch (err) {
    console.error('Error adding item:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE an item by ID
app.delete('/api/items/:id', async (req, res) => {
  try {
    // Find the item by ID and delete it
    const item = await Item.findByIdAndDelete(req.params.id);

    // If item not found, send 404
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item removed' }); // Confirm successful deletion
  } catch (err) {
    console.error('Error deleting item:', err);
    // Check for invalid ObjectId format
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
