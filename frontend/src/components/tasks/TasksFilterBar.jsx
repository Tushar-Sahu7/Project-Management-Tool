import { Button } from "@/components/ui/button";
import { FunnelIcon } from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TasksFilterBar({ statusFilter, priorityFilter, onStatusChange, onPriorityChange }) {
  return (
    <div className="flex items-center gap-4">
      {/* Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 border-dashed">
            <FunnelIcon className="h-4 w-4" />
            <span className="text-muted-foreground mr-1">Status</span>
            <span className="font-semibold capitalize text-foreground">
              {statusFilter === "all" ? "All" : statusFilter}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuItem onClick={() => onStatusChange("all")} className={statusFilter === "all" ? "bg-muted" : ""}>
            All Statuses
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("todo")} className={statusFilter === "todo" ? "bg-muted" : ""}>
            To Do
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("in-progress")} className={statusFilter === "in-progress" ? "bg-muted" : ""}>
            In Progress
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("done")} className={statusFilter === "done" ? "bg-muted" : ""}>
            Done
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Priority Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 border-dashed">
            <FunnelIcon className="h-4 w-4" />
            <span className="text-muted-foreground mr-1">Priority</span>
            <span className="font-semibold capitalize text-foreground">
              {priorityFilter === "all" ? "All" : priorityFilter}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuItem onClick={() => onPriorityChange("all")} className={priorityFilter === "all" ? "bg-muted" : ""}>
            All Priorities
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPriorityChange("low")} className={priorityFilter === "low" ? "bg-muted" : ""}>
            Low
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPriorityChange("medium")} className={priorityFilter === "medium" ? "bg-muted" : ""}>
            Medium
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPriorityChange("high")} className={priorityFilter === "high" ? "bg-muted" : ""}>
            High
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
