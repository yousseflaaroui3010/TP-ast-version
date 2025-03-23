// backend/routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Get all tasks for the user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ position: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get tasks by column
router.get('/column/:columnId', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ 
      column: req.params.columnId,
      user: req.user.id 
    }).sort({ position: 1 });
    
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Add a task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, column, labels, priority, dueDate } = req.body;
    
    // Find the highest position in the column to add at the end
    const lastTask = await Task.findOne({ 
      column, 
      user: req.user.id 
    }).sort({ position: -1 });
    
    const position = lastTask ? lastTask.position + 1 : 0;
    
    const task = new Task({
      title,
      description,
      column,
      position,
      labels: labels || [],
      priority: priority || 'medium',
      dueDate: dueDate || null,
      user: req.user.id
    });
    
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Update a task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    
    // Update fields if provided
    const fields = ['title', 'description', 'completed', 'column', 'labels', 'priority', 'dueDate', 'position'];
    
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });
    
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée ou non autorisée' });
    }
    
    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Tâche supprimée' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
  }
});

// Move task between columns and reorder
router.post('/move', auth, async (req, res) => {
  try {
    const { taskId, sourceColumnId, destinationColumnId, newPosition } = req.body;
    
    const task = await Task.findOne({ 
      _id: taskId, 
      user: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    
    // Moving to a different column
    if (sourceColumnId !== destinationColumnId) {
      task.column = destinationColumnId;
    }
    
    // Update position
    task.position = newPosition;
    await task.save();
    
    // If tasks are moved within the same column, we need to reorder other tasks
    if (sourceColumnId === destinationColumnId) {
      // Update positions of other tasks in the column
      await Task.updateMany(
        { 
          column: sourceColumnId,
          _id: { $ne: taskId },
          position: { $gte: newPosition }
        },
        { $inc: { position: 1 } }
      );
    }
    
    res.json({ message: 'Tâche déplacée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;