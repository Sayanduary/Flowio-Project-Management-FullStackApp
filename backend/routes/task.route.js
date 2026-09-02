import express from "express";
import {
  createTask,
  deleteTask,
  updateTask,
} from "../controller/task.controller.js";

const taskRouter = express.Router();

taskRouter.post("/", createTask);
taskRouter.put("/:id", updateTask);
taskRouter.put("/", updateTask);
taskRouter.post("/delete", deleteTask);
taskRouter.delete("/:id", deleteTask);
taskRouter.delete("/", deleteTask);

export default taskRouter;
