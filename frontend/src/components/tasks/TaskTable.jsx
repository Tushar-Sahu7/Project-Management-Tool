import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrashIcon,
  PencilSimpleIcon,
  SpinnerIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowsDownUpIcon,
} from "@phosphor-icons/react";

export function TaskTable({ tasks, deletingId, sortField, sortOrder, onSort, onEdit, onDelete }) {
  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowsDownUpIcon className="ml-2 h-4 w-4 text-muted-foreground" />;
    return sortOrder === "asc" ? (
      <ArrowUpIcon className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDownIcon className="ml-2 h-4 w-4" />
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "done":
        return <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-500/20">Done</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 border-blue-500/20">In Progress</Badge>;
      default:
        return <Badge variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">To Do</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="bg-rose-500/15 text-rose-600 hover:bg-rose-500/25 border-rose-500/20">High</Badge>;
      case "medium":
        return <Badge className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 border-amber-500/20">Medium</Badge>;
      default:
        return <Badge variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">Low</Badge>;
    }
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden text-card-foreground">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="w-[40%] font-semibold text-foreground">Task</TableHead>
            <TableHead className="font-semibold text-foreground">
              <button
                className="flex items-center hover:text-primary transition-colors focus:outline-none"
                onClick={() => onSort("status")}
              >
                Status {getSortIcon("status")}
              </button>
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              <button
                className="flex items-center hover:text-primary transition-colors focus:outline-none"
                onClick={() => onSort("priority")}
              >
                Priority {getSortIcon("priority")}
              </button>
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              <button
                className="flex items-center hover:text-primary transition-colors focus:outline-none"
                onClick={() => onSort("dueDate")}
              >
                Due Date {getSortIcon("dueDate")}
              </button>
            </TableHead>
            <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                No tasks found. Create one to get started!
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task._id} className="group transition-colors border-b last:border-0 hover:bg-muted/50">
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{task.title}</p>
                    {task.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(task.status)}</TableCell>
                <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onEdit(task)}
                    >
                      <PencilSimpleIcon className="h-4 w-4" />
                      <span className="sr-only">Edit task</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(task._id)}
                      disabled={deletingId === task._id}
                    >
                      {deletingId === task._id ? (
                        <SpinnerIcon className="h-4 w-4 animate-spin" />
                      ) : (
                        <TrashIcon className="h-4 w-4" />
                      )}
                      <span className="sr-only">Delete task</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
