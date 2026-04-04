const mongoose = require("mongoose");
const ProjectModel = require("../models/Project.model");
const TaskModel = require("../models/Task.model");

//POST /projects
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400)
        .json({ message: "Name and description of project are required" });
    }

    const project = await ProjectModel.create({
      name: name,
      description: description
    });

    res.status(201).json({
      message: "Project created successfully",
      data: project
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//GET /projects -all pagination projects
const getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);

    const skip = (page - 1) * limit;
    const [projects, total] = await Promise.all([
      ProjectModel.find().skip(skip).limit(limit),
      ProjectModel.countDocuments()
    ]);

    res.status(200).json({
      message: "Projects fetched successfully",
      data: projects,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//GET /projects/:id
const getProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID format" });
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({
      message: "Project fetched successfully",
      data: project
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//DELETE /projects/:id
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID format" });
    }

    const project = await ProjectModel.findByIdAndDelete(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    //Deletes all the tasks inside the projects
    await TaskModel.deleteMany({ projectId });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createProject, getProjects, getProject, deleteProject };