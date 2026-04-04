import { useState, useEffect, useCallback } from "react";
import { getProjects, deleteProject } from "@/services/api";
import { toast } from "sonner";

export function useProjects(initialLimit = 10) {
  const [projects, setProjects] = useState([]);
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(initialLimit);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProjects = useCallback(async (page = 1, currentLimit = limit) => {
    try {
      setLoading(true);
      const result = await getProjects(page, currentLimit);
      setProjects(result.data);
      setMeta(result.meta);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchProjects(1, limit);
  }, [fetchProjects, limit]);

  const handleLimitChange = (newLimit) => {
    const parsed = parseInt(newLimit, 10);
    setLimit(parsed);
    fetchProjects(1, parsed);
  };

  const removeProject = async (e, id) => {
    e.stopPropagation();
    try {
      setDeletingId(id);
      await deleteProject(id);
      toast.success("Project deleted successfully");
      
      const newTotal = meta.totalCount - 1;
      const expectedPages = Math.ceil(newTotal / limit);
      const newPage = meta.currentPage > expectedPages ? Math.max(1, expectedPages) : meta.currentPage;
      
      fetchProjects(newPage);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  return {
    projects,
    meta,
    loading,
    limit,
    deletingId,
    fetchProjects,
    handleLimitChange,
    removeProject,
  };
}
