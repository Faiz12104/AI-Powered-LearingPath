import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import ChatHistory from "../models/ChatHistory.js";
import * as geminiService from "../utils/geminiService.js";
import { chunkText, findRelevantChunks } from "../utils/textChunker.js";

const getUsableChunks = (document) => {
  const validStoredChunks = (document.chunks || []).filter(
    (chunk) => typeof chunk?.content === "string" && chunk.content.trim()
  );

  if (validStoredChunks.length > 0) {
    return validStoredChunks;
  }

  if (document.extractedText?.trim()) {
    return chunkText(document.extractedText, 500, 50);
  }

  return [];
};


/* =========================================================
   Generate Flashcards
========================================================= */
export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count = 10 } = req.body;

    // Validate input
    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "Please provide documentId",
        statusCode: 400
      });
    }

    // Find document
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready"
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found or not ready",
        statusCode: 404
      });
    }

    if (!document.extractedText) {
      return res.status(400).json({
        success: false,
        error: "Document text not available",
        statusCode: 400,
      });
    }

    // 🔥 Generate flashcards using Gemini
    const cards = await geminiService.generateFlashcards(
      document.extractedText,
      parseInt(count)
    );

    if (!cards || cards.length === 0) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate flashcards",
      });
    }

    // 💾 Save to database
    const flashcardSet = await Flashcard.create({
      userId: req.user._id,
      documentId: document._id,
      cards: cards.map(card => ({
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty || "medium",
        reviewCount: 0,
        isStarred: false,
        lastReviewed: null,
      })),
    });

    return res.status(201).json({
      success: true,
      data: flashcardSet,
      message: "Flashcards generated successfully"
    });

  } catch (error) {
    console.error("Generate Flashcards Error:", error);
    next(error);
  }
};

/* =========================================================
   Generate Quiz
========================================================= */
export const generateQuiz = async (req, res, next) => {
  try {
    const { documentId, numQuestions = 5, title } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId',
        statusCode: 400,
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready',
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready',
        statusCode: 404,
      });
    }

    // Generate quiz using Gemini
    const questions = await geminiService.generateQuiz(
      document.extractedText,
      parseInt(numQuestions)
    );

    // Save to database
    const quiz = await Quiz.create({
      userId: req.user._id,
      documentId: document._id,
      title: title || `${document.title} - Quiz`,
      questions: questions,
      totalQuestions: questions.length,
      userAnswers: [],
      score: 0,
    });

    res.status(201).json({
      success: true,
      data: quiz,
      message: 'Quiz generated successfully',
    });

  } catch (error) {
    next(error);
  }
};


/* =========================================================
   Generate Summary
========================================================= */
export const generateSummary = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId',
        statusCode: 400
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready',
        statusCode: 404
      });
    }

    // Generate summary using Gemini
    const summary = await geminiService.generateSummary(
      document.extractedText
    );

    res.status(200).json({
      success: true,
      data: {
        documentId: document._id,
        title: document.title,
        summary
      },
      message: 'Summary generated successfully'
    });

  } catch (error) {
    next(error);
  }
};

/* =========================================================
   Chat with Document
========================================================= */
export const chat = async (req, res, next) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId and question',
        statusCode: 400
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready',
        statusCode: 404
      });
    }

    const usableChunks = getUsableChunks(document);
    let relevantChunks = findRelevantChunks(usableChunks, question, 3);

    if (relevantChunks.length === 0) {
      relevantChunks = usableChunks.slice(0, 3);
    }

    const chunkIndices = relevantChunks.map(c => c.chunkIndex);

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: document._id
    });

    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        userId: req.user._id,
        documentId: document._id,
        messages: []
      });
    }

    // Generate response using Gemini
    const answer = await geminiService.chatWithContext(
      question,
      relevantChunks
    );

    // Save conversation
    chatHistory.messages.push(
      {
        role: 'user',
        content: question,
        timestamp: new Date(),
        relevantChunks: []
      },
      {
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
        relevantChunks: chunkIndices
      }
    );

    await chatHistory.save();

    res.status(200).json({
      success: true,
      data: {
        question,
        answer,
        relevantChunks: chunkIndices,
        chatHistoryId: chatHistory._id
      },
      message: 'Response generated successfully'
    });

  } catch (error) {
    next(error);
  }
};

/* =========================================================
   Explain Concept
========================================================= */
export const explainConcept = async (req, res, next) => {
  try {
    const { documentId, concept } = req.body;

    if (!documentId || !concept) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId and concept',
        statusCode: 400
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready',
        statusCode: 404
      });
    }

    // Find relevant chunks for the concept
    const usableChunks = getUsableChunks(document);
    let relevantChunks = findRelevantChunks(
      usableChunks,
      concept,
      3
    );

    if (relevantChunks.length === 0) {
      relevantChunks = usableChunks.slice(0, 3);
    }

    const context = relevantChunks
      .map(c => c.content)
      .join('\n\n');

    // Generate explanation using Gemini
    const explanation = await geminiService.explainConcept(
      concept,
      context
    );

    res.status(200).json({
      success: true,
      data: {
        concept,
        explanation,
        relevantChunks: relevantChunks.map(c => c.chunkIndex)
      },
      message: 'Explanation generated successfully'
    });

  } catch (error) {
    next(error);
  }
};

/* =========================================================
   Get Chat History
========================================================= */
export const getChatHistory = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId',
        statusCode: 400
      });
    }

    const chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: documentId
    }).select('messages'); // Only retrieve messages

    if (!chatHistory) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No chat history found for this document'
      });
    }

    res.status(200).json({
      success: true,
      data: chatHistory.messages,
      message: 'Chat history retrieved successfully'
    });

  } catch (error) {
    next(error);
  }
};
