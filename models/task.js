// models/task.js

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    description: String,

    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'low',
    },

    deadline: Date,

    is_completed: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
