
const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const multer = require('multer');
const { taskValidations, validateTask } = require('../validations/taskValidations');

var upload = multer();

// Get a list of tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Create a new task
router.post('/tasks', upload.array(), taskValidations, validateTask, async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Delete the task
router.delete('/tasks', async (req, res) => {
  const deleteId = req.query.delete;
  try {
    await Task.deleteOne({ "_id": deleteId });
    res.status(200).json({ message: 'Data deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Update the task
router.patch('/tasks', upload.array(), taskValidations, validateTask, async (req, res) => {
  const updateId = req.query.update;
  const updatedData = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(updateId, updatedData, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Invalid Task' });
    }
    res.status(200).json({ success: true, data: updatedTask });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/tasks/filter', async (req, res) => {
  const query = {};
  const title = req.query.title;
  const priority = req.query.priority;
  const deadline = req.query.deadline;

  try {
    if (title) {
      query.title = { $regex: title, $options: 'i' }; // Case-insensitive partial match
    }

    if (priority) {
      query.priority = priority.toUpperCase();
    }

    if (deadline) {
      switch (deadline) {
        case 'past':
          query.deadline = { $lt: new Date() };
          break;
        case 'today':
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          const todayEnd = new Date();
          todayEnd.setHours(23, 59, 59, 999);
          query.deadline = { $gte: todayStart, $lte: todayEnd };
          break;
        case 'future':
          query.deadline = { $gt: new Date() };
          break;
      }
    }

    const tasks = await Task.find(query);

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
