/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/firebase/firebaseConfig";
import { TaskFormValues } from "@/types/types";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  Query,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

// Create a task
export const createTask = async (userId: string, task: TaskFormValues) => {
  try {
    const userTasksRef = collection(db, "usertasks", userId, "tasks");
    const taskDocRef = doc(userTasksRef, task.id);
    await setDoc(taskDocRef, { ...task });
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

// Read Tasks
export const getTasks = async (
  userId: string,
  category?: string,
  searchText?: string
) => {
  try {
    const userTasksRef = collection(db, "usertasks", userId, "tasks");
    let q: Query<DocumentData> = userTasksRef;

    if (category) {
      q = query(q, where("category", "==", category));
    }
    if (searchText) {
      q = query(
        q,
        where("title", ">=", searchText),
        where("title", "<=", searchText + "\uf8ff")
      );
    }

    const querySnapshot = await getDocs(q);
    const response: TaskFormValues[] = querySnapshot.docs.map((doc) => {
      const data: DocumentData = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        category: data.category,
        dueDate: data.dueDate,
        status: data.status,
        attachment: data.attachment,
      } as TaskFormValues;
    });
    return response;
  } catch (error) {
    console.error("Error getting tasks:", error);
  }
};

// Update a task
export const updateTask = async (
  userId: string,
  taskId: string,
  updatedTask: Partial<TaskFormValues>
) => {
  try {
    const taskRef = doc(db, "usertasks", userId, "tasks", taskId);
    await updateDoc(taskRef, updatedTask);
  } catch (error) {
    console.error("Error updating tasks:", error);
  }
};

// Delete a task
export const deleteTask = async (userId: string, taskId: string) => {
  try {
    const taskRef = doc(db, "usertasks", userId, "tasks", taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.log("Error deleting task:", error);
  }
};

// Batch Delete
export const batchDeleteTasks = async (userId: string, taskIds: string[]) => {
  const batch = writeBatch(db);
  taskIds.forEach((taskId) => {
    const taskDocRef = doc(db, "usertasks", userId, "tasks", taskId);
    batch.delete(taskDocRef);
  });
  await batch.commit();
};
