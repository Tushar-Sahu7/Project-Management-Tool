const mongoose = require("mongoose");
const TaskModel = require("../models/Task.model");
const ProjectModel = require("../models/Project.model");

//POST /projects/:projectId/tasks
const createTask = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    if (!projectId) {
      return res.status(400).json({ message: "Project Id is required" })
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID format" });
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !description || !status || !priority || !dueDate) {
      return res.status(400).json({ message: "Some fields are missing" });
    }

    const task = await TaskModel.create({
      projectId, title, description, status, priority, dueDate
    });

    if (!task) {
      return res.status(400).json({ message: "Task creation failed" })
    }

    res.status(201).json({
      message: "Task created successfully",
      data: task
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//GET /projects/:projectId/tasks
const getTasks = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    if (!projectId) {
      return res.status(400).json({ message: "Project Id is required" })
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID format" });
    }

    const [tasks, total] = await Promise.all([
      TaskModel.find({ projectId }).skip(skip).limit(limit),
      TaskModel.countDocuments({ projectId })
    ])

    res.status(200).json({
      message: "Tasks fetched successfully",
      data: tasks,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      }
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//PUT /tasks/:id
const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    if (!taskId) {
      return res.status(400).json({ message: "Task Id is required" })
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid Task ID format" });
    }

    const ALLOWED_UPDATES = [
      "title",
      "description",
      "status",
      "priority",
      "dueDate"
    ];

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body cannot be empty" });
    }

    const isTaskFieldEditAllowed = Object.keys(req.body).every((key) =>
      ALLOWED_UPDATES.includes(key),
    );

    if (!isTaskFieldEditAllowed) {
      return res.status(400).json({ message: "Invalid task update request" })
    }

    const task = await TaskModel.findByIdAndUpdate(taskId, req.body, { returnDocument: "after", runValidators: true });

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    res.status(200).json({
      message: "Task updated successfully",
      data: task
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });

  }
};

//DELETE /tasks/:id
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      return res.status(400).json({ message: "Task Id is required" })
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid Task ID format" });
    }

    const task = await TaskModel.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    res.status(200).json({ message: "Task deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };