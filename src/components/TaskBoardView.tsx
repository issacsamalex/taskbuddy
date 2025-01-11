import { TaskFormValues } from "@/types/types";
import TaskCard from "./TaskCard";

type TaskBoardProps = {
  tasks: TaskFormValues[] | undefined;
  onEdit: (task: TaskFormValues) => void;
  onDelete: (taskId: string) => void;
  statuses: readonly string[];
  todos: TaskFormValues[];
  inProgress: TaskFormValues[];
  completed: TaskFormValues[];
};

const TaskBoardView = ({
  tasks,
  onEdit,
  onDelete,
  statuses,
  todos,
  inProgress,
  completed,
}: TaskBoardProps) => {
  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statuses.map((status) => {
        return (
          <TaskCard
            key={status}
            status={status}
            tasks={tasks}
            onEdit={onEdit}
            onDelete={onDelete}
            todos={todos}
            inProgress={inProgress}
            completed={completed}
          />
        );
      })}
    </div>
  );
};

export default TaskBoardView;
