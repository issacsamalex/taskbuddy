import { Accordion } from "../ui/accordion";
import { TaskFormValues } from "@/types/types";
import TaskList from "./TaskList";
import { Checkbox } from "../ui/checkbox";

type TaskListViewProps = {
  tasks: TaskFormValues[] | undefined;
  onEdit: (task: TaskFormValues) => void;
  onDelete: (taskId: string) => void;
  statuses: readonly string[];
  todos: TaskFormValues[];
  inProgress: TaskFormValues[];
  completed: TaskFormValues[];
  selectAll: boolean;
  handleSelectAll: () => void;
  selectedTaskIds: string[];
  handleSelectTask: (taskId: string) => void;
};

const TaskListView = ({
  tasks,
  onEdit,
  onDelete,
  statuses,
  todos,
  inProgress,
  completed,
  selectAll,
  handleSelectAll,
  selectedTaskIds,
  handleSelectTask,
}: TaskListViewProps) => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-6 gap-4 bg-gray-100 p-4 rounded-md">
        <div className="flex items-center gap-2">
          <Checkbox
            id="selectAll"
            checked={selectAll}
            onCheckedChange={handleSelectAll}
          />
          <label
            htmlFor="terms1"
            className="text-sm font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Select All
          </label>
        </div>
        <div className="font-bold">Task Name</div>
        <div className="font-bold">Due On</div>
        <div className="font-bold">Task Status</div>
        <div className="font-bold">Task Category</div>
        <div className="font-bold">Actions</div>
      </div>
      <Accordion type="multiple" className="mt-4">
        {statuses.map((status) => {
          return (
            <TaskList
              key={status}
              status={status}
              tasks={tasks}
              onEdit={onEdit}
              onDelete={onDelete}
              todos={todos}
              inProgress={inProgress}
              completed={completed}
              selectedTaskIds={selectedTaskIds}
              handleSelectTask={handleSelectTask}
            />
          );
        })}
      </Accordion>
    </div>
  );
};

export default TaskListView;
