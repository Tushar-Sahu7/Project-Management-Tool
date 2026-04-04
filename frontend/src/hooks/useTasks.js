import { useState, useEffect, useCallback, useMemo } from "react";
import { getProject, getTasks, createTask, updateTask, deleteTask } from "@/services/api";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function useTasks(projectId, initialLimit = 10) {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
  const [limit, setLimit] = useState(initialLimit);

  // Filters and sorting
  const [sortField, setSortField] = useState(""); // "status", "priority", "dueDate"
  const [sortOrder, setSortOrder] = useState(""); // "asc", "desc", or ""
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  const fetchData = useCallback(async (page = 1, currentLimit = limit) => {
    try {
      setLoading(true);
      const [projectRes, tasksRes] = await Promise.all([
        getProject(projectId),
        getTasks(projectId, page, currentLimit),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setMeta(tasksRes.meta);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load data");
      if (error?.response?.status === 404) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  }, [projectId, limit, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLimitChange = (newLimit) => {
    const parsed = parseInt(newLimit, 10);
    setLimit(parsed);
    fetchData(1, parsed);
  };

  const addOrUpdateTask = async (taskId, formData) => {
    try {
      if (taskId) {
        await updateTask(projectId, taskId, formData);
        toast.success("Task updated successfully");
      } else {
        await createTask(projectId, formData);
        toast.success("Task created successfully");
      }
      fetchData(meta.currentPage);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save task");
      throw error;
    }
  };

  const removeTask = async (taskId) => {
    try {
      setDeletingId(taskId);
      await deleteTask(projectId, taskId);
      toast.success("Task deleted successfully");
      fetchData(meta.currentPage);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete task");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusWeight = (s) => ({ "todo": 1, "in-progress": 2, "done": 3 }[s] || 0);
  const getPriorityWeight = (p) => ({ "low": 1, "medium": 2, "high": 3 }[p] || 0);

  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      if (statusFilter !== "all" && task.status !== statusFilter) return false;
      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
      return true;
    });

    if (sortField && sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        let cmp = 0;
        if (sortField === "status") {
          cmp = getStatusWeight(a.status) - getStatusWeight(b.status);
        } else if (sortField === "priority") {
          cmp = getPriorityWeight(a.priority) - getPriorityWeight(b.priority);
        } else if (sortField === "dueDate") {
          const dateA = new Date(a.dueDate || "9999-12-31").getTime();
          const dateB = new Date(b.dueDate || "9999-12-31").getTime();
          cmp = dateA - dateB;
        }
        return sortOrder === "asc" ? cmp : -cmp;
      });
    }
    return filtered;
  }, [tasks, statusFilter, priorityFilter, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      if (sortOrder === "asc") setSortOrder("desc");
      else if (sortOrder === "desc") {
        setSortOrder("");
        setSortField("");
      } else setSortOrder("asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return {
    project,
    tasks,
    loading,
    meta,
    limit,
    deletingId,
    sortField,
    sortOrder,
    statusFilter,
    priorityFilter,
    filteredTasks,
    setStatusFilter,
    setPriorityFilter,
    handleSort,
    handleLimitChange,
    fetchData,
    addOrUpdateTask,
    removeTask,
  };
}
