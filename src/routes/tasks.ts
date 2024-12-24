import { Router } from "express";
import TaskController from "../controllers/tasks.controller";

const router = Router();

// Define routes and map them to the class-based methods
router.get("/", TaskController.getAllTasks);
router.post("/", TaskController.createTask);
router.put("/:id", TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);
router.get("/:id", TaskController.getTaskById);

export default router;
