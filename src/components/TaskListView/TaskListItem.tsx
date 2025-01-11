/* eslint-disable @typescript-eslint/no-unused-vars */
import { TaskFormValues } from "@/types/types";
import { format, isToday } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { useDrag } from "react-dnd";

type TaskListItemProps = {
  task: TaskFormValues;
  onEdit: (task: TaskFormValues) => void;
  onDelete: (taskId: string) => void;
  selectedTaskIds: string[];
  handleSelectTask: (taskId: string) => void;
};

const TaskListItem = ({
  task,
  onEdit,
  onDelete,
  selectedTaskIds,
  handleSelectTask,
}: TaskListItemProps) => {
  const formatDate = (date: Date): string => {
    if (isToday(date)) {
      return "Today";
    }
    return format(date, "dd MMM yyyy");
  };

  const [, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="grid grid-cols-6 gap-4 py-2 px-4 border-b last:border-none cursor-pointer"
    >
      <div>
        <Checkbox
          checked={selectedTaskIds.includes(task.id)}
          onCheckedChange={() => handleSelectTask(task.id)}
        />
      </div>
      <div>{task.title}</div>
      <div>{formatDate(new Date(task.dueDate)) || "No Date"}</div>
      <div>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</div>
      <div>
        {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
      </div>
      <div>
        <Popover>
          <PopoverTrigger>
            <Button variant="ghost">
              <Ellipsis />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col w-36">
            <Button
              onClick={() => onEdit(task)}
              className="flex justify-start"
              variant="ghost"
            >
              <Pencil /> <p>Edit</p>
            </Button>
            <Button
              onClick={() => onDelete(task.id)}
              className="flex justify-start text-red-600"
              variant="ghost"
            >
              <Trash2 /> <p>Delete</p>
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TaskListItem;
