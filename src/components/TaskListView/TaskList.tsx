/* eslint-disable @typescript-eslint/no-explicit-any */
import { TaskFormValues } from "@/types/types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import TaskListItem from "./TaskListItem";
import { useDrop } from "react-dnd";
import { useAuth } from "@/context/AuthContext";
import { useUpdateTask } from "@/hooks/useUserTasks";

type DragItem = {
  id: string;
};

type TaskListProps = {
  status: string;
  tasks: TaskFormValues[] | undefined;
  onEdit: (task: TaskFormValues) => void;
  onDelete: (taskId: string) => void;
  todos: TaskFormValues[];
  inProgress: TaskFormValues[];
  completed: TaskFormValues[];
  selectedTaskIds: string[];
  handleSelectTask: (taskId: string) => void;
};

const TaskList = ({
  status,
  tasks,
  onEdit,
  onDelete,
  todos,
  inProgress,
  completed,
  selectedTaskIds,
  handleSelectTask,
}: TaskListProps) => {
  let tasksByStatus = todos;
  if (status === "in-progress") {
    tasksByStatus = inProgress;
  }
  if (status === "completed") {
    tasksByStatus = completed;
  }

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

  return (
    <AccordionItem
      ref={drop}
      value={status}
      className="mb-8 bg-gray-100 rounded-t-xl rounded-b-lg border-2"
    >
      <AccordionTrigger
        className={`text-lg font-medium py-2 px-4 rounded-t-xl ${
          status === "todo"
            ? "bg-purple-200 hover:bg-purple-300"
            : status === "in-progress"
            ? "bg-cyan-200 hover:bg-cyan-300"
            : "bg-green-200 hover:bg-green-300"
        }`}
      >
        {status.toUpperCase()}
      </AccordionTrigger>
      <AccordionContent>
        <div className="divide-y">
          {tasksByStatus.length > 0 ? (
            tasksByStatus.map((task) => (
              <TaskListItem
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                selectedTaskIds={selectedTaskIds}
                handleSelectTask={handleSelectTask}
              />
            ))
          ) : (
            <div className="flex justify-center items-center w-full h-40">
              <p className="text-lg">No Tasks in {status}</p>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default TaskList;
