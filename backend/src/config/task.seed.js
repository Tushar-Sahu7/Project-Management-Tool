const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("./db");
const ProjectModel = require("../models/Project.model");
const TaskModel = require("../models/Task.model");

const statuses = ["todo", "in-progress", "done"];
const priorities = ["low", "medium", "high"];

const taskTemplates = [
  "Set up project scaffolding",
  "Design database schema",
  "Create API endpoints",
  "Write unit tests",
  "Implement authentication",
  "Build landing page",
  "Add form validation",
  "Configure CI/CD pipeline",
  "Optimize database queries",
  "Write API documentation",
  "Implement search feature",
  "Add pagination support",
  "Create user dashboard",
  "Set up error logging",
  "Implement file uploads",
  "Add email notifications",
  "Create admin panel",
  "Write integration tests",
  "Fix responsive layout",
  "Deploy to production",
];

const taskSeed = async () => {
  try {
    await connectDB();

    // Fetch 20 project IDs from the database
    const projects = await ProjectModel.find().limit(20).select("_id name");

    if (projects.length === 0) {
      console.error("No projects found. Run the project seed first.");
      return;
    }

    console.log(`Found ${projects.length} projects. Creating 20 tasks per project...`);

    const tasks = [];

    for (const project of projects) {
      for (let i = 0; i < 20; i++) {
        // Generate a due date between 1-60 days from now
        const daysFromNow = Math.floor(Math.random() * 60) + 1;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + daysFromNow);

        tasks.push({
          projectId: project._id,
          title: `${taskTemplates[i]} — ${project._id.toString().slice(-4)}`,
          description: `Task ${i + 1}: ${taskTemplates[i]} for ${project.name}`,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          dueDate,
        });
      }
    }

    await TaskModel.insertMany(tasks);
    console.log(`${tasks.length} tasks seeded successfully (${projects.length} projects × 20 tasks)`);
  } catch (error) {
    console.error("Task seeding failed:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

taskSeed();
