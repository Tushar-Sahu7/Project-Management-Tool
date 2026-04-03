const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: [true, "Project Id is required"],
    },

    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Task description is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: {
        values: ["todo", "in-progress", "done"],
        message: "Status must be valid tag",
      },
      required: [true, "Task status is required"],
      default: "todo",
    },

    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be valid tag",
      },
      required: [true, "Priority is required"],
      default: "medium",
    },

    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("task", taskSchema);
