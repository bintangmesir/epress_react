import express from "express";
import {
  getTodos,
  getTodosById,
  createTodos,
  updateTodos,
  deleteTodos,
} from "../controllers/UserController.js";

const router = express.Router();

router.get("/todos", getTodos);
router.get("/todos/:id", getTodosById);
router.post("/todos", createTodos);
router.patch("/todos/:id", updateTodos);
router.delete("/todos/:id", deleteTodos);

export default router;