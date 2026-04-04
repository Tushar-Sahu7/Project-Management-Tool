import { useState } from "react";
import { useNavigate } from "react-router";
import { useProjects } from "@/hooks/useProjects";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { ProjectCreateDialog } from "@/components/projects/ProjectCreateDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon, FolderOpenIcon, SpinnerIcon, ArrowUpIcon } from "@phosphor-icons/react";

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const {
    projects,
    meta,
    loading,
    limit,
    deletingId,
    fetchProjects,
    handleLimitChange,
    removeProject,
  } = useProjects();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects Workspace</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your projects and track progress across all tasks.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <PlusIcon className="h-5 w-5" weight="bold" />
              New Project
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && projects.length === 0 ? (
          <div className="py-20 text-center">
            <SpinnerIcon className="mx-auto flex h-10 w-10 animate-spin text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Loading your projects...</p>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-16 text-center bg-card shadow-sm">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <FolderOpenIcon className="h-10 w-10 text-primary" weight="duotone" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">No projects yet</h3>
                <p className="mt-2 max-w-md text-muted-foreground">
                  Get started by creating a new project workspace. You'll be able to add tasks, set priorities, and track progress.
                </p>
                <Button onClick={() => setDialogOpen(true)} className="mt-6 gap-2">
                  <PlusIcon className="h-5 w-5" weight="bold" />
                  Create First Project
                </Button>
              </div>
            ) : (
              /* Projects Grid */
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Card 
                    key={project._id} 
                    className="group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50 cursor-pointer"
                    onClick={() => navigate(`/projects/${project._id}`)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="line-clamp-1 text-lg group-hover:text-primary transition-colors">
                          {project.name}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 -mt-1 -mr-1 hover:bg-destructive/10"
                          onClick={(e) => removeProject(e, project._id)}
                          disabled={deletingId === project._id}
                        >
                          {deletingId === project._id ? (
                            <SpinnerIcon className="h-4 w-4 animate-spin" />
                          ) : (
                            <TrashIcon className="h-4 w-4" />
                          )}
                          <span className="sr-only">Delete project</span>
                        </Button>
                      </div>
                      <CardDescription className="line-clamp-2 mt-1">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="bg-muted px-2 py-1 rounded-md">
                          Updated {new Date(project.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>

                    <CardAction>
                      <div className="flex w-full items-center justify-between px-6 py-3 text-sm font-medium text-primary bg-primary/5 group-hover:bg-primary/10 transition-colors">
                        View Tasks
                        <ArrowUpIcon className="h-4 w-4 rotate-45" />
                      </div>
                    </CardAction>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination Extracted Component */}
            <PaginationBar 
              meta={meta} 
              limit={limit} 
              onPageChange={fetchProjects} 
              onLimitChange={handleLimitChange} 
            />
          </>
        )}

        {/* Create Project Extracted Dialog */}
        <ProjectCreateDialog 
          open={dialogOpen} 
          onOpenChange={setDialogOpen} 
        />
      </div>
    </div>
  );
};

export default ProjectsPage;
