const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");

const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "1.0.0.1"]);
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.status(200).send("API is running...");
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is listening on PORT: ${process.env.PORT || 5000}`);
});
