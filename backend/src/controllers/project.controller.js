//POST /projects
const createProject = (req, res) => {
  res.send("createProject called successfully");
};

//GET /projects -all pagination projects
const getProjects = (req, res) => {
  res.send("getProjects called successfully");
};

//GET /projects/:id
const getProject = (req, res) => {
  res.send("getProject called successfully");
};

//DELETE /projects/:id
const deleteProject = (req, res) => {
  res.send("deleteProject called successfully");
};

module.exports = { createProject, getProjects, getProject, deleteProject };