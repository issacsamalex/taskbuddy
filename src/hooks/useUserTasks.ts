import {
  batchDeleteTasks,
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "@/api/taskApi";
import { TaskFormValues } from "@/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fetching Tasks Hook
export const useTasks = (
  userId: string,
  category?: string,
  searchText?: string
) => {
  if (!userId) {
    throw new Error("UserId is required to fetch tasks");
  }
  return useQuery({
    queryKey: ["tasks", userId, category, searchText],
    queryFn: async () => {
      const tasks = await getTasks(userId, category, searchText);
      return tasks;
    },
    enabled: userId ? true : false,
  });
};

// Create Task Hook
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  // const { user } = useAuth();
  // return useMutation((task: TaskFormValues) => createTask(userId, task), {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["tasks", userId]);
  //   },
  // });
  return useMutation({
    mutationFn: async ({
      userId,
      task,
    }: {
      userId: string;
      task: TaskFormValues;
    }) => {
      createTask(userId, task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
};

// Update Task Hook
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      taskId,
      task,
    }: {
      userId: string;
      taskId: string;
      task: TaskFormValues;
    }) => {
      updateTask(userId, taskId, task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
};

// Delete Task Hook
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      taskId,
    }: {
      userId: string;
      taskId: string;
    }) => {
      deleteTask(userId, taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
};

// Batch Delete
export const useBatchDeleteTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      taskIds,
    }: {
      userId: string;
      taskIds: string[];
    }) => {
      batchDeleteTasks(userId, taskIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
};
