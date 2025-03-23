// backend/routes/columns.js
const express = require('express');
const router = express.Router();
const TaskColumn = require('../models/TaskColumn');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Get all columns for the user
router.get('/', auth, async (req, res) => {
  try {
    const columns = await TaskColumn.find({ user: req.user.id }).sort({ position: 1 });
    res.json(columns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Create a new column
router.post('/', auth, async (req, res) => {
  try {
    // Find the highest position to add new column at the end
    const lastColumn = await TaskColumn.findOne({ user: req.user.id })
      .sort({ position: -1 });
    
    const position = lastColumn ? lastColumn.position + 1 : 0;
    
    const column = new TaskColumn({
      title: req.body.title,
      position: position,
      user: req.user.id
    });
    
    await column.save();
    res.status(201).json(column);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Update a column
router.put('/:id', auth, async (req, res) => {
  try {
    const column = await TaskColumn.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!column) {
      return res.status(404).json({ message: 'Colonne non trouvée' });
    }
    
    // Update title if provided
    if (req.body.title) {
      column.title = req.body.title;
    }
    
    // Update position if provided
    if (req.body.position !== undefined) {
      column.position = req.body.position;
    }
    
    await column.save();
    res.json(column);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Delete a column
router.delete('/:id', auth, async (req, res) => {
  try {
    const column = await TaskColumn.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!column) {
      return res.status(404).json({ message: 'Colonne non trouvée' });
    }
    
    // Delete all tasks in this column first
    await Task.deleteMany({ column: req.params.id });
    
    // Then delete the column
    await TaskColumn.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Colonne supprimée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Reorder columns
router.post('/reorder', auth, async (req, res) => {
  try {
    const { columnOrder } = req.body;
    
    // Update each column position
    const updateOperations = columnOrder.map((item, index) => {
      return TaskColumn.updateOne(
        { _id: item.id, user: req.user.id },
        { $set: { position: index }}
      );
    });
    
    await Promise.all(updateOperations);
    
    res.json({ message: 'Colonnes réorganisées avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;