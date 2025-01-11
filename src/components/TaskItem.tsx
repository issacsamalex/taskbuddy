/* eslint-disable @typescript-eslint/no-unused-vars */
import { TaskFormValues } from "@/types/types";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { format, isToday } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useDrag } from "react-dnd";

type TaskItemProps = {
  task: TaskFormValues;
  onEdit: (task: TaskFormValues) => void;
  onDelete: (taskId: string) => void;
};

const TaskItem = ({ task, onEdit, onDelete }: TaskItemProps) => {
  const [, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const formatDate = (date: Date): string => {
    if (isToday(date)) {
      return "Today";
    }
    return format(date, "dd MMM yyyy");
  };

  return (
    <Card
      ref={drag}
      className={`${
        task.status === "todo"
          ? "border-l-8 border-l-purple-500"
          : task.status === "in-progress"
          ? "border-l-8 border-l-cyan-500"
          : "border-l-8 border-l-green-500"
      } cursor-pointer mb-4`}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle
          className={`${task.status === "completed" ? "line-through" : ""}`}
        >
          {task.title}
        </CardTitle>
        <Popover>
          <PopoverTrigger asChild>
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
      </CardHeader>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">{task.category}</p>
        <p className="text-sm text-muted-foreground">
          {formatDate(new Date(task.dueDate)) || "No Date"}
        </p>
      </CardFooter>
    </Card>
  );
};

export default TaskItem;
