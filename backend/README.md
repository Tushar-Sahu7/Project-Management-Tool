# Project Management Tool — API Documentation

A RESTful API for managing projects and their tasks, built with **Node.js**, **Express**, and **MongoDB** (Mongoose).

---

## Base URL

```
http://localhost:7777
```

---

## Response Format

All endpoints return JSON with a consistent structure:

**Success:**
```json
{
  "message": "Descriptive success message",
  "data": { ... }
}
```

**Error:**
```json
{
  "message": "Descriptive error message"
}
```

---

## Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/`      | Check if the API is running |

**Response:** `200 OK`
```
API is running...
```

---

## Projects

### Data Model

| Field         | Type     | Required | Description            |
|---------------|----------|----------|------------------------|
| `_id`         | ObjectId | auto     | Unique identifier      |
| `name`        | String   | ✅       | Project name           |
| `description` | String   | ✅       | Project description    |
| `createdAt`   | Date     | auto     | Timestamp of creation  |
| `updatedAt`   | Date     | auto     | Timestamp of last edit |

---

### `POST /projects` — Create a Project

Creates a new project.

**Request Body:**
```json
{
  "name": "E-Commerce App",
  "description": "A full-stack e-commerce application"
}
```

**Success Response:** `201 Created`
```json
{
  "message": "Project created successfully",
  "data": {
    "_id": "661e2f1a4b3c5d6e7f8a9b0c",
    "name": "E-Commerce App",
    "description": "A full-stack e-commerce application",
    "createdAt": "2026-04-04T05:30:00.000Z",
    "updatedAt": "2026-04-04T05:30:00.000Z"
  }
}
```

**Error Responses:**

| Status | Condition |
|--------|-----------|
| `400`  | `name` or `description` missing |
| `500`  | Internal server error |

---

### `GET /projects` — Get All Projects (Paginated)

Returns a paginated list of all projects.

**Query Parameters:**

| Param   | Type   | Default | Max | Description             |
|---------|--------|---------|-----|-------------------------|
| `page`  | Number | `1`     | —   | Page number             |
| `limit` | Number | `10`    | 100 | Number of items per page |

**Example Request:**
```
GET /projects?page=1&limit=5
```

**Success Response:** `200 OK`
```json
{
  "message": "Projects fetched successfully",
  "data": [
    {
      "_id": "661e2f1a4b3c5d6e7f8a9b0c",
      "name": "E-Commerce App",
      "description": "A full-stack e-commerce application",
      "createdAt": "2026-04-04T05:30:00.000Z",
      "updatedAt": "2026-04-04T05:30:00.000Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 3,
    "totalCount": 12
  }
}
```

**Error Responses:**

| Status | Condition |
|--------|-----------|
| `500`  | Internal server error |

---

### `GET /projects/:id` — Get a Single Project

Returns a single project by its ID.

**URL Parameters:**

| Param | Type     | Description           |
|-------|----------|-----------------------|
| `id`  | ObjectId | The project's `_id`   |

**Example Request:**
```
GET /projects/661e2f1a4b3c5d6e7f8a9b0c
```

**Success Response:** `200 OK`
```json
{
  "message": "Project fetched successfully",
  "data": {
    "_id": "661e2f1a4b3c5d6e7f8a9b0c",
    "name": "E-Commerce App",
    "description": "A full-stack e-commerce application",
    "createdAt": "2026-04-04T05:30:00.000Z",
    "updatedAt": "2026-04-04T05:30:00.000Z"
  }
}
```

**Error Responses:**

| Status | Condition |
|--------|-----------|
| `400`  | Invalid ObjectId format |
| `404`  | Project not found |
| `500`  | Internal server error |

---

### `DELETE /projects/:id` — Delete a Project

Deletes a project **and all tasks** associated with it.

**URL Parameters:**

| Param | Type     | Description         |
|-------|----------|---------------------|
| `id`  | ObjectId | The project's `_id` |

**Example Request:**
```
DELETE /projects/661e2f1a4b3c5d6e7f8a9b0c
```

**Success Response:** `200 OK`
```json
{
  "message": "Project deleted successfully"
}
```

**Error Responses:**

| Status | Condition |
|--------|-----------|
| `400`  | Invalid ObjectId format |
| `404`  | Project not found |
| `500`  | Internal server error |

> ⚠️ **Cascade Delete:** Deleting a project also deletes all tasks under that project.

---

## Tasks

### Data Model

| Field         | Type     | Required | Default    | Description                              |
|---------------|----------|----------|------------|------------------------------------------|
| `_id`         | ObjectId | auto     | —          | Unique identifier                        |
| `projectId`   | ObjectId | ✅       | —          | Reference to parent project              |
| `title`       | String   | ✅       | —          | Task title                               |
| `description` | String   | ✅       | —          | Task description                         |
| `status`      | String   | ✅       | `"todo"`   | One of: `todo`, `in-progress`, `done`    |
| `priority`    | String   | ✅       | `"medium"` | One of: `low`, `medium`, `high`          |
| `dueDate`     | Date     | ✅       | —          | Task deadline                            |
| `createdAt`   | Date     | auto     | —          | Timestamp of creation                    |
| `updatedAt`   | Date     | auto     | —          | Timestamp of last edit                   |

**Enum Values:**

| Field      | Allowed Values                  |
|------------|---------------------------------|
| `status`   | `todo`, `in-progress`, `done`   |
| `priority` | `low`, `medium`, `high`         |

---

### `POST /projects/:projectId/tasks` — Create a Task

Creates a new task under a specific project.

**URL Parameters:**

| Param       | Type     | Description             |
|-------------|----------|-------------------------|
| `projectId` | ObjectId | The parent project `_id`|

**Request Body:**
```json
{
  "title": "Design Homepage",
  "description": "Create wireframes and mockups for the homepage",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-04-15T00:00:00.000Z"
}
```

**Success Response:** `201 Created`
```json
{
  "message": "Task created successfully",
  "data": {
    "_id": "661e3a2b5c4d6e7f8a9b0d1e",
    "projectId": "661e2f1a4b3c5d6e7f8a9b0c",
    "title": "Design Homepage",
    "description": "Create wireframes and mockups for the homepage",
    "status": "todo",
    "priority": "high",
    "dueDate": "2026-04-15T00:00:00.000Z",
    "createdAt": "2026-04-04T06:00:00.000Z",
    "updatedAt": "2026-04-04T06:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Condition |
|--------|-----------|
| `400`  | Missing or invalid `projectId` format |
| `400`  | One or more required body fields missing |
| `404`  | Project with given `projectId` not found |
| `500`  | Internal server error |

---

### `GET /projects/:projectId/tasks` — Get Tasks for a Project (Paginated)

Returns a paginated list of tasks belonging to a specific project.

**URL Parameters:**

| Param       | Type     | Description              |
|-------------|----------|--------------------------|
| `projectId` | ObjectId | The parent project `_id` |

**Query Parameters:**

| Param   | Type   | Default | Max | Description              |
|---------|--------|---------|-----|--------------------------|
| `page`  | Number | `1`     | —   | Page number              |
| `limit` | Number | `10`    | 100 | Number of items per page |

**Example Request:**
```
GET /projects/661e2f1a4b3c5d6e7f8a9b0c/tasks?page=1&limit=5
```

**Success Response:** `200 OK`
```json
{
  "message": "Tasks fetched successfully",
  "data": [
    {
      "_id": "661e3a2b5c4d6e7f8a9b0d1e",
      "projectId": "661e2f1a4b3c5d6e7f8a9b0c",
      "title": "Design Homepage",
      "description": "Create wireframes and mockups for the homepage",
      "status": "todo",
      "priority": "high",
      "dueDate": "2026-04-15T00:00:00.000Z",
      "createdAt": "2026-04-04T06:00:00.000Z",
      "updatedAt": "2026-04-04T06:00:00.000Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 2,
    "totalCount": 8
  }
}
```

**Error Responses:**

| Status | Condition |
|--------|-----------|
| `400`  | Missing or invalid `projectId` format |
| `500`  | Internal server error |

> **Note:** An empty `data: []` array is returned if the project has no tasks — this is not treated as an error.

---

### `PUT /tasks/:id` — Update a Task (Full Replace)

Replaces a task's fields with the provided values. Only whitelisted fields are accepted; unknown fields are rejected.

**URL Parameters:**

| Param | Type     | Description       |
|-------|----------|-------------------|
| `id`  | ObjectId | The task's `_id`  |

**Allowed Fields in Body:**

| Field         | Type   | Description                            |
|---------------|--------|----------------------------------------|
| `title`       | String | Task title                             |
| `description` | String | Task description                       |
| `status`      | String | Must be `todo`, `in-progress`, or `done` |
| `priority`    | String | Must be `low`, `medium`, or `high`     |
| `dueDate`     | Date   | Task deadline                          |

**Request Body:**
```json
{
  "title": "Design Homepage v2",
  "description": "Updated wireframes with new brand colors",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2026-04-20T00:00:00.000Z"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Task updated successfully",
  "data": {
    "_id": "661e3a2b5c4d6e7f8a9b0d1e",
    "projectId": "661e2f1a4b3c5d6e7f8a9b0c",
    "title": "Design Homepage v2",
    "description": "Updated wireframes with new brand colors",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2026-04-20T00:00:00.000Z",
    "createdAt": "2026-04-04T06:00:00.000Z",
    "updatedAt": "2026-04-04T07:30:00.000Z"
  }
}
```

**Error Responses:**

| Status | Condition |
|--------|-----------|
| `400`  | Missing or invalid task `id` format |
| `400`  | Request body is empty |
| `400`  | Body contains fields not in the allowed list |
| `404`  | Task not found |
| `500`  | Internal server error (includes Mongoose validation failures for invalid enum values) |

**Validation Rules:**
- `status` must be one of: `todo`, `in-progress`, `done`
- `priority` must be one of: `low`, `medium`, `high`
- Fields like `_id`, `projectId`, `createdAt`, etc. are **not** allowed in the update body

---

### `DELETE /tasks/:id` — Delete a Task

Deletes a single task by ID.

**URL Parameters:**

| Param | Type     | Description      |
|-------|----------|------------------|
| `id`  | ObjectId | The task's `_id` |

**Example Request:**
```
DELETE /tasks/661e3a2b5c4d6e7f8a9b0d1e
```

**Success Response:** `200 OK`
```json
{
  "message": "Task deleted successfully"
}
```

**Error Responses:**

| Status | Condition |
|--------|-----------|
| `400`  | Missing or invalid task `id` format |
| `404`  | Task not found |
| `500`  | Internal server error |

---

## API Routes Summary

| Method   | Endpoint                        | Description                  |
|----------|---------------------------------|------------------------------|
| `GET`    | `/`                             | Health check                 |
| `POST`   | `/projects`                     | Create a project             |
| `GET`    | `/projects`                     | Get all projects (paginated) |
| `GET`    | `/projects/:id`                 | Get a single project         |
| `DELETE` | `/projects/:id`                 | Delete a project + its tasks |
| `POST`   | `/projects/:projectId/tasks`    | Create a task in a project   |
| `GET`    | `/projects/:projectId/tasks`    | Get tasks in a project (paginated) |
| `PUT`    | `/tasks/:id`                    | Update a task                |
| `DELETE` | `/tasks/:id`                    | Delete a task                |

---

## Error Codes Reference

| Status Code | Meaning               | When It Occurs                                    |
|-------------|-----------------------|---------------------------------------------------|
| `200`       | OK                    | Successful read, update, or delete                |
| `201`       | Created               | Successful resource creation                      |
| `400`       | Bad Request           | Missing fields, invalid ID format, invalid body   |
| `404`       | Not Found             | Resource does not exist                           |
| `500`       | Internal Server Error | Unexpected server-side failure                    |

---

## Environment Variables

| Variable    | Description                     | Default |
|-------------|---------------------------------|---------|
| `PORT`      | Server port                     | `5000`  |
| `MONGO_URI` | MongoDB connection string       | —       |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create a .env file with your MongoDB URI
PORT=7777
MONGO_URI=mongodb+srv://your-connection-string

# 3. Start the development server
npm run dev
```

The API will be available at `http://localhost:7777`.
