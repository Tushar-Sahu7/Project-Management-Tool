const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProject,
  deleteProject,
} = require("../controllers/project.controller");
const {
  createTask,
  getTasks,
} = require("../controllers/task.controller");

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProject);
router.delete("/:id", deleteProject);

router.post("/:projectId/tasks", createTask);
router.get("/:projectId/tasks", getTasks);

module.exports = router;
