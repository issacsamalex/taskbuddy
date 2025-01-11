/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import FilterBar from "@/components/FilterBar";
import FormDialog from "@/components/FormDialog";
import Navbar from "@/components/Navbar";
import TaskBoardView from "@/components/TaskBoardView";
import TaskListView from "@/components/TaskListView/TaskListView";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filters, TaskFormValues } from "@/types/types";
import { useAuth } from "@/context/AuthContext";
import { List, Loader, SquareKanban, X } from "lucide-react";
import {
  useBatchDeleteTasks,
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTask,
} from "@/hooks/useUserTasks";
import { useToast } from "@/hooks/use-toast";

const TaskPage = () => {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState<Filters["search"]>();
  const [category, setCategory] = useState<Filters["category"]>();
  const {
    data: tasksData,
    isLoading,
    isError,
    error,
  } = useTasks(currentUser?.uid || "", category, search);
  const statuses = ["todo", "in-progress", "completed"] as const;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState("add");
  const [selectedTask, setSelectedTask] = useState<TaskFormValues | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();
  const batchdeleteMutation = useBatchDeleteTasks();
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(false);

  const handleSave = (task: TaskFormValues) => {
    try {
      if (selectedTask && currentUser?.uid) {
        try {
          updateTaskMutation.mutate({
            userId: currentUser.uid,
            taskId: selectedTask.id,
            task,
          });
          setSelectedTask(null);
        } catch (error) {
          console.error(error);
        }
      } else {
        if (currentUser?.uid) {
          try {
            createTaskMutation.mutate({ userId: currentUser.uid, task });
            toast({
              title: "Task added successfully",
            });
          } catch (error) {
            console.error(error);
            toast({
              title: "Task not added",
              variant: "destructive",
            });
          }
        } else {
          console.error(
            "User ID is not available. Make sure the user is logged in."
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Editing form fn
  const handleEdit = (task: TaskFormValues) => {
    setSelectedTask(task);
    setIsModalOpen(true);
    setFormType("edit");
  };

  // Task deletion fn
  const handleDelete = (taskId: string) => {
    try {
      if (currentUser?.uid) {
        try {
          deleteMutation.mutate({ userId: currentUser.uid, taskId });
          toast({
            title: "Task deleted successfully",
          });
        } catch (error) {
          console.error(error);
          toast({
            title: "Uh oh! Something went wrong.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // set TaskIds fn
  const handleSelectTask = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  // selectAll fn
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTaskIds([]);
    } else {
      if (tasksData?.length) {
        setSelectedTaskIds(tasksData.map((task: any) => task.id));
      }
    }
    setSelectAll(!selectAll);
  };

  // Batch delete fn
  const handleBatchDelete = () => {
    try {
      if (currentUser?.uid) {
        batchdeleteMutation.mutate({
          userId: currentUser.uid,
          taskIds: selectedTaskIds,
        });
        setSelectedTaskIds([]);
        toast({
          title: "Tasks deleted successfully",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Uh oh! Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const todos: TaskFormValues[] = useMemo(
    () => tasksData?.filter((task: any) => task.status === "todo") || [],
    [tasksData]
  );
  const inProgress = useMemo(
    () => tasksData?.filter((task: any) => task.status === "in-progress") || [],
    [tasksData]
  );
  const completed = useMemo(
    () => tasksData?.filter((task: any) => task.status === "completed") || [],
    [tasksData]
  );

  // Identify mobile screen
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="w-full h-screen flex justify-center items-center">
          <Loader className="h-8 w-8 animate-spin z-50 text-purple-500" />
        </div>
      </>
    );
  } else if (isError) {
    return (
      <>
        <div className="w-full h-screen flex justify-center items-center">
          <p className="text-xl font-semibold text-red-600">{error.message}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="mx-4">
        <header className="flex justify-between items-start sm:items-center mb-6">
          <FilterBar
            onChange={(filters) => {
              setCategory(filters.category);
              setSearch(filters.search);
            }}
          />
          <div className="flex space-x-2">
            <Button
              className="bg-purple-800 rounded-full sm:px-10 sm:py-5 hover:bg-purple-700"
              onClick={() => {
                setIsModalOpen(true);
                setSelectedTask(null);
                setFormType("add");
              }}
            >
              ADD TASK
            </Button>
          </div>
        </header>

        <Tabs defaultValue="board">
          {!isMobile && (
            <TabsList className="mb-4">
              <TabsTrigger value="list">
                <div className="flex items-center gap-1">
                  <List className="w-5 h-5" />{" "}
                  <span className="text-sm">List View</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="board">
                <div className="flex items-center gap-1">
                  <SquareKanban className="w-5 h-5" />{" "}
                  <span className="text-sm">Board View</span>
                </div>
              </TabsTrigger>
            </TabsList>
          )}
          {!isMobile && (
            <TabsContent value="list">
              <TaskListView
                tasks={tasksData}
                onEdit={handleEdit}
                onDelete={handleDelete}
                statuses={statuses}
                todos={todos}
                inProgress={inProgress}
                completed={completed}
                selectAll={selectAll}
                handleSelectAll={handleSelectAll}
                selectedTaskIds={selectedTaskIds}
                handleSelectTask={handleSelectTask}
              />
            </TabsContent>
          )}
          <TabsContent value="board">
            <TaskBoardView
              tasks={tasksData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              statuses={statuses}
              todos={todos}
              inProgress={inProgress}
              completed={completed}
            />
          </TabsContent>
        </Tabs>

        {/* Edit/view Modal */}
        <FormDialog
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
          onSave={handleSave}
          formType={formType}
          initialData={selectedTask}
        />
        {/* Bottom Popup */}
        {selectedTaskIds.length > 0 && (
          <div className="fixed left-0 right-0 bottom-4 flex items-center justify-center m-auto w-fit h-fit bg-gray-700 rounded-lg border border-gray-200 shadow-lg px-4 py-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border-[1px] border-gray-200 rounded-full px-3 py-1">
                <span className="text-white text-sm font-light">
                  {selectedTaskIds.length} task(s) selected
                </span>
                <X
                  onClick={() => {
                    setSelectedTaskIds([]);
                    setSelectAll(false);
                  }}
                  className="text-white cursor-pointer"
                />
              </div>
              <Button onClick={handleBatchDelete} variant="destructive">
                Delete selected
              </Button>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default TaskPage;
