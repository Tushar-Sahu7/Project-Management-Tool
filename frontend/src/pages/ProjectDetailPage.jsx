import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useTasks } from "@/hooks/useTasks";

// Components
import { PaginationBar } from "@/components/shared/PaginationBar";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TasksFilterBar } from "@/components/tasks/TasksFilterBar";
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog";
import { ThemeToggle } from "@/components/ThemeToggle";

// UI Wrappers
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Icons
import { PlusIcon, SpinnerIcon, CaretLeftIcon } from "@phosphor-icons/react";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Load Task Hook
  const {
    project,
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
  } = useTasks(id);

  // Local UI State for Dialog mapping
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const openAddDialog = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const openEditDialog = (task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleSaveTask = async (taskId, formData) => {
    await addOrUpdateTask(taskId, formData);
  };

  if (loading && !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <SpinnerIcon className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading project workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                  Projects
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{project?.name || "Project Details"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <ThemeToggle />
        </div>

        <Card className="mb-6 border-none shadow-none bg-transparent">
          <CardHeader className="pb-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <CardTitle className="text-3xl font-bold tracking-tight">
                  {project?.name}
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground max-w-2xl">
                  {project?.description}
                </CardDescription>
              </div>
              <Button onClick={openAddDialog} className="gap-2 shrink-0 md:mt-1">
                <PlusIcon className="h-5 w-5" weight="bold" />
                Add Task
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Filters and Controls */}
        <div className="mb-4">
          <TasksFilterBar 
            statusFilter={statusFilter} 
            priorityFilter={priorityFilter} 
            onStatusChange={setStatusFilter} 
            onPriorityChange={setPriorityFilter} 
          />
        </div>

        {/* Task Table */}
        <TaskTable 
          tasks={filteredTasks}
          deletingId={deletingId}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={openEditDialog}
          onDelete={removeTask}
        />

        {/* Pagination Extracted Component */}
        <PaginationBar 
          meta={meta} 
          limit={limit} 
          onPageChange={fetchData} 
          onLimitChange={handleLimitChange} 
        />

        {/* Add/Edit Extracted Dialog */}
        <TaskFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          editingTask={editingTask}
          onSave={handleSaveTask}
        />
      </div>
    </div>
  );
};

export default ProjectDetailPage;
