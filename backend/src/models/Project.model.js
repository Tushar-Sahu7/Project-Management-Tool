const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("project", projectSchema);
