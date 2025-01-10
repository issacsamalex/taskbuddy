import { taskSchema } from "@/schema";

export type TaskFormValues = z.infer<typeof taskSchema>;

export type Filters = {
  category?: "work" | "personal";
  search?: string;
};
