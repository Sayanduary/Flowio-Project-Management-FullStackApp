import express from "express";
import {
  addMember,
  createProject,
  deleteProject,
  updateProject,
} from "../controller/project.controller.js";
const projectRouter = express.Router();

projectRouter.post("/", createProject);
projectRouter.put("/:projectId", updateProject);
projectRouter.put("/", updateProject);
projectRouter.delete("/:projectId", deleteProject);
projectRouter.delete("/", deleteProject);
projectRouter.post("/:projectId/addMember", addMember);

export default projectRouter;
