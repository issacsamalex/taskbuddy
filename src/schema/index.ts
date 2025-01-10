import * as z from "zod";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(["work", "personal"], {
    required_error: "Category is required",
  }),
  dueDate: z
    .string({ required_error: "Due date is required" })
    .min(1, "Due date is required"),
  status: z.enum(["todo", "in-progress", "completed"], {
    required_error: "Status is required",
  }),
  attachment: z.any().optional(),
});
