const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("./db");
const ProjectModel = require("../models/Project.model");

const projectSeed = async () => {
  try {
    await connectDB();
    const projects = [];
    for (let i = 1; i <= 100; i++) {
      projects.push({
        name: `Project ${i}`,
        description: `This is the description for Project ${i}`
      });
    }

    await ProjectModel.insertMany(projects);
    console.log("100 projects seeded successfully");
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

projectSeed();