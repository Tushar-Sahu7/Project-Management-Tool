const express = require("express");
const router = express.Router();
const {
  updateTask,
  deleteTask
} = require("../controllers/task.controller");


router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
