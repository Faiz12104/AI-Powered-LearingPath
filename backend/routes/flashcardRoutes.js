import express from "express";
import {
  getFlashcards,
  getAllFlashcardSets,
  reviewFlashcard,
  toggleStarFlashcard,
  deleteFlashcardSet,
} from "../controller/flashcardController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// Protect all flashcard routes
router.use(protect);

// Get all flashcard sets for logged-in user
router.get("/", getAllFlashcardSets);

// Get flashcards for a specific document
router.get("/:documentId", getFlashcards);

// Review a flashcard (mark correct/incorrect)
router.post("/:cardId/review", reviewFlashcard);

// Toggle star on a flashcard
router.put("/:cardId/star", toggleStarFlashcard);

// Delete a flashcard set
router.delete("/:id", deleteFlashcardSet);

export default router;