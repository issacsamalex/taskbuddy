import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { taskSchema } from "@/schema";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";
import { TaskFormValues } from "@/types/types";
import { storage } from "@/firebase/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TaskFormValues) => void;
  formType: string;
  initialData?: TaskFormValues | null;
};

const FormDialog = ({
  isOpen,
  formType,
  onClose,
  onSave,
  initialData,
}: Props) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      id: uuidv4(),
      title: "",
      description: "",
      category: "personal",
      dueDate: "",
      status: "todo",
      attachment: "",
    },
  });

  useEffect(() => {
    if (formType === "edit" && initialData) {
      form.reset(initialData);
    } else if (formType === "add") {
      form.reset({
        id: uuidv4(),
        title: "",
        description: "",
        category: "personal",
        dueDate: "",
        status: "todo",
        attachment: "",
      });
    }
  }, [formType, initialData]);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const storageRef = ref(storage, `files/${uuidv4()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      toast({
        description: "File upload completed",
      });
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        variant: "destructive",
        description: "File upload failed",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileURL = await handleFileUpload(file);

    if (fileURL) {
      form.setValue("attachment", fileURL);
    }
  };

  const onSubmit = (data: TaskFormValues) => {
    onSave(data);
    form.reset();
    onClose();
  };

  // console.log(initialData.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {formType === "add" ? "Create Task" : "Edit Task"}
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  {form.formState.errors.title && (
                    <p className="text-red-500">
                      {form.formState?.errors?.title?.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Task description" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="category"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Category</FormLabel>
                  <div className="flex gap-2">
                    <Button
                      className={`rounded-lg hover:bg-purple-700 hover:text-white ${
                        field.value === "work"
                          ? "bg-purple-800"
                          : "bg-gray-200 text-black"
                      } `}
                      type="button"
                      onClick={() => field.onChange("work")}
                    >
                      Work
                    </Button>
                    <Button
                      className={`rounded-lg hover:bg-purple-700 hover:text-white ${
                        field.value === "personal"
                          ? "bg-purple-800"
                          : "bg-gray-200 text-black"
                      } `}
                      type="button"
                      onClick={() => field.onChange("personal")}
                    >
                      Personal
                    </Button>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="dueDate"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col my-2">
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date?.toDateString())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  {form.formState.errors.dueDate && (
                    <p className="text-red-500">
                      {form.formState?.errors?.dueDate?.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
            <FormField
              name="status"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <span>{field.value}</span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="attachment"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachment</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        handleFileChange(e.target.files);
                      }}
                      disabled={uploading}
                    />
                  </FormControl>
                  {uploading ? <p>Uploading file...</p> : <></>}
                  {field.value && (
                    <div className="mt-2">
                      {field.value.endsWith(".pdf") ? (
                        <a
                          href={field.value}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open PDF
                        </a>
                      ) : (
                        <img
                          src={field.value}
                          alt="Uploaded"
                          className="h-24 w-24 rounded-md"
                        />
                      )}
                    </div>
                  )}
                </FormItem>
              )}
            />
            <Separator className="my-4" />
            <DialogFooter>
              <Button
                className="rounded-full bg-gray-200"
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-purple-800 rounded-full hover:bg-purple-700"
              >
                {formType === "add" ? "Create" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
