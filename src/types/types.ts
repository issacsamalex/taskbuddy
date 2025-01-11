import { taskSchema } from "@/schema";
import { z } from "zod";

export type TaskFormValues = z.infer<typeof taskSchema>;

export type TaskStatus = TaskFormValues["status"];

export type UseTasksReturn = {
  data: TaskFormValues[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

export type Filters = {
  category?: "work" | "personal";
  search?: string;
};
