//POST /projects/:projectId/tasks
const createTask = (req, res) => {
  res.send("createTask called successfully");
};

//GET /projects/:projectId/tasks
const getTasks = (req, res) => {
  res.send("getTasks called successfully");
};

//PUT /tasks/:id
const updateTask = (req, res) => {
  res.send("updateTask called successfully");
};

//DELETE /tasks/:id
const deleteTask = (req, res) => {
  res.send("deleteTask called successfully");
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
