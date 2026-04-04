import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

//Projects

// POST /projects
export const createProject = async (data) => {
  const response = await api.post("/projects", data);
  return response.data;
};

// GET /projects?page=&limit=
export const getProjects = async (page = 1, limit = 10) => {
  const response = await api.get("/projects", {
    params: { page, limit },
  });
  return response.data;
};

// GET /projects/:id
export const getProject = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

// DELETE /projects/:id
export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

//Task

// POST /projects/:projectId/tasks
export const createTask = async (projectId, data) => {
  const response = await api.post(`/projects/${projectId}/tasks`, data);
  return response.data;
};

// GET /projects/:projectId/tasks?page=&limit=
export const getTasks = async (projectId, page = 1, limit = 10) => {
  const response = await api.get(`/projects/${projectId}/tasks`, {
    params: { page, limit },
  });
  return response.data;
};

// PUT /tasks/:id
export const updateTask = async (id, data) => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
};

// DELETE /tasks/:id
export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};
