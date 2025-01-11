/* eslint-disable @typescript-eslint/no-explicit-any */
import { TaskFormValues } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import TaskItem from "./TaskItem";
import { useDrop } from "react-dnd";
import { useAuth } from "@/context/AuthContext";
import { useUpdateTask } from "@/hooks/useUserTasks";

type DragItem = {
  id: string;
};

type TaskCardProps = {
  status: string;
  tasks: TaskFormValues[] | undefined;
  onEdit: (task: TaskFormValues) => void;
  onDelete: (taskId: string) => void;
  todos: TaskFormValues[];
  inProgress: TaskFormValues[];
  completed: TaskFormValues[];
};

const TaskCard = ({
  status,
  tasks,
  onEdit,
  onDelete,
  todos,
  inProgress,
  completed,
}: TaskCardProps) => {
  const { currentUser } = useAuth();
  const updateTaskMutation = useUpdateTask();
  const addItemToCard = (id: string) => {
    const updatedTask = tasks?.find((task) => task.id === id);
    if (currentUser?.uid && updatedTask) {
      updateTaskMutation.mutate({
        userId: currentUser.uid,
        taskId: id,
        task: {
          ...updatedTask,
          status: status as "todo" | "in-progress" | "completed",
        },
      });
    }
  };

  const [, drop] = useDrop<DragItem>(() => ({
    accept: "task",
    drop: (item) => addItemToCard(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  let tasksByStatus = todos;
  if (status === "in-progress") {
    tasksByStatus = inProgress;
  }
  if (status === "completed") {
    tasksByStatus = completed;
  }

  return (
    <Card ref={drop} className="h-screen overflow-auto mb-6 bg-slate-200">
      <CardHeader>
        <CardTitle>
          <Badge
            className={`${
              status === "todo"
                ? "bg-purple-200 hover:bg-purple-400"
                : status === "in-progress"
                ? "bg-cyan-200 hover:bg-cyan-400"
                : "bg-green-200 hover:bg-green-400"
            } text-black`}
          >
            {status.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasksByStatus.length > 0 &&
          tasksByStatus.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
      </CardContent>
      {tasksByStatus.length === 0 && (
        <div className="flex justify-center items-center h-[80vh]">
          <p className="text-lg">No Tasks in {status}</p>
        </div>
      )}
    </Card>
  );
};

export default TaskCard;
