const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Get task statistics
router.get('/', auth, async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
      { $group: {
          _id: "$priority",
          count: { $sum: 1 },
          completed: { 
            $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] }
          }
        }
      }
    ]);
    
    res.json(stats);
  } catch (err) {
    console.error('Error fetching task stats:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;