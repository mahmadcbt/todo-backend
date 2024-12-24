import { Request, Response } from "express";
import prisma from "../prisma/client";
import { successResponse, errorResponse } from "../utils/response-wrapper";

class TaskController {
  /**
   * Fetches all tasks from the database.
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public async getAllTasks(req: Request, res: Response): Promise<void> {
    try {
      // Fetch tasks and counts in parallel
      const [tasks, totalTasks, completedTasks] = await Promise.all([
        // Fetch tasks sorted with incomplete tasks first
        prisma.task.findMany({
          orderBy: {
            completed: "asc", // Sort by 'completed', false (incomplete) first, then true (complete)
          },
        }),
        // Get the total count of tasks
        prisma.task.count(),
        // Get the count of completed tasks
        prisma.task.count({ where: { completed: true } }),
      ]);

      // Response with tasks and counts
      res.status(200).json(
        successResponse(
          {
            tasks,
            totalTasks,
            completedTasks,
          },
          "Tasks fetched successfully"
        )
      );
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json(errorResponse("Server error", error));
    }
  }

  /**
   * Creates a new task in the database.
   * @param req - Express Request object containing `title` and optional `color` in the body
   * @param res - Express Response object
   */
  public async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { title, color } = req.body;

      if (!title) {
        res.status(400).json(errorResponse("Title is required"));
        return;
      }

      const newTask = await prisma.task.create({
        data: { title, color },
      });

      res
        .status(201)
        .json(successResponse(newTask, "Task created successfully"));
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json(errorResponse("Server error", error));
    }
  }

  /**
   * Updates an existing task in the database by its ID.
   * @param req - Express Request object containing:
   *  - `id` as a URL parameter (ID of the task to update)
   *  - `title`, `color`, and `completed` as optional fields in the body
   * @param res - Express Response object
   */
  public async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, color, completed } = req.body;

      const existingTask = await prisma.task.findUnique({
        where: { id: Number(id) },
      });

      if (!existingTask) {
        res.status(404).json(errorResponse("Task not found"));
        return;
      }

      const updatedTask = await prisma.task.update({
        where: { id: Number(id) },
        data: {
          title: title ?? existingTask.title,
          color: color ?? existingTask.color,
          completed: completed ?? existingTask.completed,
        },
      });

      res
        .status(200)
        .json(successResponse(updatedTask, "Task updated successfully"));
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json(errorResponse("Server error", error));
    }
  }

  /**
   * Deletes a task from the database by its ID.
   * @param req - Express Request object containing `id` as a URL parameter (ID of the task to delete)
   * @param res - Express Response object
   */
  public async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const existingTask = await prisma.task.findUnique({
        where: { id: Number(id) },
      });

      if (!existingTask) {
        res.status(404).json(errorResponse("Task not found"));
        return;
      }

      await prisma.task.delete({ where: { id: Number(id) } });
      res.status(204).json(successResponse(null, "Task deleted successfully"));
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json(errorResponse("Server error", error));
    }
  }

  /**
   * Fetches a task from the database by its ID.
   * @param req - Express Request object containing `id` as a URL parameter (ID of the task to fetch)
   * @param res - Express Response object
   */
  public async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params; // Extract the task ID from the URL params

      // Validate the ID
      if (!id || isNaN(Number(id))) {
        res.status(400).json(errorResponse("Invalid task ID"));
        return;
      }

      // Fetch the task from the database
      const task = await prisma.task.findUnique({
        where: { id: Number(id) },
      });

      // Check if the task exists
      if (!task) {
        res.status(404).json(errorResponse("Task not found"));
        return;
      }

      // Respond with the fetched task
      res.status(200).json(successResponse(task, "Task fetched successfully"));
    } catch (error) {
      console.error("Error fetching task by ID:", error);
      res.status(500).json(errorResponse("Server error", error));
    }
  }
}

export default new TaskController();
