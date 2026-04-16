import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import documentService from "../../services/documentService";
import aiService from "../../services/aiService";
import flashcardService from "../../services/flashcardService";
import quizService from "../../services/quizService";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  ExternalLink,
  GraduationCap,
  Layers3,
  Sparkles,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Tabs from "../../components/common/Tabs";
import ChatInterface from "../../components/chat/chatInterface";
import MarkdownRenderer from "../../components/common/MarkdownRenderer";
import Button from "../../components/common/Button";

const DocumentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [concept, setConcept] = useState("");
  const [conceptResult, setConceptResult] = useState("");
  const [conceptLoading, setConceptLoading] = useState(false);
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [flashcardsLoading, setFlashcardsLoading] = useState(true);
  const [generatingFlashcards, setGeneratingFlashcards] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [quizzesLoading, setQuizzesLoading] = useState(true);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (error) {
        toast.error("Failed to fetch document details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await flashcardService.getFlashcardsForDocument(id);
        setFlashcardSets(response?.data || []);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to fetch flashcards.");
      } finally {
        setFlashcardsLoading(false);
      }
    };

    const fetchQuizzes = async () => {
      try {
        const response = await quizService.getQuizzesForDocument(id);
        setQuizzes(response?.data || []);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to fetch quizzes.");
      } finally {
        setQuizzesLoading(false);
      }
    };

    fetchFlashcards();
    fetchQuizzes();
  }, [id]);

  // Helper function to get full PDF URL
  const getPdfUrl = () => {
    if (!document?.filePath) return null;

    const filePath = document.filePath;

    if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://")
    ) {
      return filePath;
    }

    const baseUrl =
      process.env.REACT_APP_API_URL || "http://localhost:8000";

    return `${baseUrl}${
      filePath.startsWith("/") ? "" : "/"
    }${filePath}`;
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (!document || !document.filePath) {
      return (
        <div className="text-center text-gray-500">
          PDF not available.
        </div>
      );
    }

    const pdfUrl = getPdfUrl();

    return (
      <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)]">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/90 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <span className="text-sm font-medium text-gray-700">
            Document Viewer
          </span>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>

        {/* Viewer */}
        <div className="bg-slate-100 p-2 sm:p-3">
          <iframe
            src={pdfUrl}
            className="h-[60vh] w-full rounded-[1.25rem] bg-white sm:h-[70vh]"
            title="PDF Viewer"
            frameBorder="0"
            style={{ colorScheme: "light" }}
          />
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return <ChatInterface />;
  };

  const handleGenerateSummary = async () => {
    setSummaryLoading(true);

    try {
      const data = await aiService.generateSummary(id);
      setSummary(data?.summary || "Summary not available.");
      setActiveTab("AI Actions");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to generate summary.");
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleExplainConcept = async (event) => {
    event.preventDefault();

    if (!concept.trim()) {
      toast.error("Please enter a concept first.");
      return;
    }

    setConceptLoading(true);

    try {
      const data = await aiService.explainConcept(id, concept.trim());
      setConceptResult(data?.explanation || "Explanation not available.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to explain concept.");
    } finally {
      setConceptLoading(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    setGeneratingFlashcards(true);

    try {
      const response = await aiService.generateFlashcards(id, { count: 10 });
      const newSet = response?.data;
      if (newSet) {
        setFlashcardSets((prev) => [newSet, ...prev]);
        setDocument((prev) =>
          prev
            ? { ...prev, flashcardCount: (prev.flashcardCount || 0) + 1 }
            : prev
        );
      }
      toast.success("Flashcards generated successfully.");
      setActiveTab("Flashcards");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to generate flashcards.");
    } finally {
      setGeneratingFlashcards(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setGeneratingQuiz(true);

    try {
      const response = await aiService.generateQuiz(id, { numQuestions: 5 });
      const newQuiz = response?.data;
      if (newQuiz) {
        setQuizzes((prev) => [newQuiz, ...prev]);
        setDocument((prev) =>
          prev ? { ...prev, quizCount: (prev.quizCount || 0) + 1 } : prev
        );
      }
      toast.success("Quiz generated successfully.");
      setActiveTab("Quizzes");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to generate quiz.");
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const renderAIctions = () => {
    return (
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.4)] sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Generate Summary
              </h3>
              <p className="text-sm text-slate-500">
                Document ka concise overview aur key takeaways nikalo.
              </p>
            </div>
          </div>

          <Button onClick={handleGenerateSummary} disabled={summaryLoading}>
            {summaryLoading ? "Generating..." : "Generate Summary"}
          </Button>

          <div className="mt-5 min-h-44 rounded-[1.5rem] border border-slate-100 bg-slate-50/90 p-4 sm:p-5">
            {summary ? (
              <MarkdownRenderer content={summary} />
            ) : (
              <p className="text-sm text-slate-500">
                Summary yahan show hogi.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.4)] sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Layers3 size={18} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Explain Concept
              </h3>
              <p className="text-sm text-slate-500">
                Kisi concept, keyword ya topic ko simple words me samjhao.
              </p>
            </div>
          </div>

          <form onSubmit={handleExplainConcept} className="space-y-4">
            <input
              type="text"
              value={concept}
              onChange={(event) => setConcept(event.target.value)}
              placeholder="e.g. recursion, closures, HTTP caching"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />

            <Button type="submit" disabled={conceptLoading}>
              {conceptLoading ? "Explaining..." : "Explain"}
            </Button>
          </form>

          <div className="mt-5 min-h-44 rounded-[1.5rem] border border-slate-100 bg-slate-50/90 p-4 sm:p-5">
            {conceptResult ? (
              <MarkdownRenderer content={conceptResult} />
            ) : (
              <p className="text-sm text-slate-500">
                Explanation yahan show hogi.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFlashcardsTab = () => {
    if (flashcardsLoading) {
      return <Spinner />;
    }

    return (
      <div className="space-y-5">
        <div className="flex flex-col gap-4 rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.4)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Flashcards
              </h3>
              <p className="text-sm text-slate-500">
                Generated sets ko review karo ya naya set banao.
              </p>
            </div>
          </div>

          <Button onClick={handleGenerateFlashcards} disabled={generatingFlashcards}>
            {generatingFlashcards ? "Generating..." : "Generate Flashcards"}
          </Button>
        </div>

        {flashcardSets.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/90 px-6 py-10 text-center">
            <p className="text-sm font-medium text-slate-700">
              Abhi is document ke liye koi flashcard set nahi hai.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {flashcardSets.map((set) => (
              <div
                key={set._id}
                className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.45)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
                      Flashcard Set
                    </p>
                    <h4 className="mt-2 text-lg font-semibold text-slate-900">
                      {document?.title}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      {set.cards?.length || 0} cards available
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(`/documents/${id}/flashcard/${set._id}`)
                    }
                  >
                    Open
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderQuizzesTab = () => {
    if (quizzesLoading) {
      return <Spinner />;
    }

    return (
      <div className="space-y-5">
        <div className="flex flex-col gap-4 rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.4)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <GraduationCap size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Quizzes
              </h3>
              <p className="text-sm text-slate-500">
                Practice tests generate karo aur result track karo.
              </p>
            </div>
          </div>

          <Button onClick={handleGenerateQuiz} disabled={generatingQuiz}>
            {generatingQuiz ? "Generating..." : "Generate Quiz"}
          </Button>
        </div>

        {quizzes.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/90 px-6 py-10 text-center">
            <p className="text-sm font-medium text-slate-700">
              Abhi is document ke liye koi quiz available nahi hai.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.45)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
                      Quiz
                    </p>
                    <h4 className="mt-2 text-lg font-semibold text-slate-900">
                      {quiz.title}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      {quiz.totalQuestions} questions
                      {quiz.completedAt ? ` | Score ${quiz.score}%` : " | Not attempted yet"}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(
                        quiz.completedAt
                          ? `/quizzes/${quiz._id}/results`
                          : `/quizzes/${quiz._id}`
                      )
                    }
                  >
                    {quiz.completedAt ? "View Result" : "Start"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: renderChat() },
    { name: "AI Actions", label: "AI Actions", content: renderAIctions() },
    { name: "Flashcards", label: "Flashcards", content: renderFlashcardsTab() },
    { name: "Quizzes", label: "Quizzes", content: renderQuizzesTab() },
  ];

  if (loading) {
    return <Spinner />;
  }

  if (!document) {
    return (
      <div className="text-center text-gray-500">
        Document not found.
      </div>
    );
  }

 return (
  <div className="relative">
    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 rounded-[2.5rem] bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_38%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.8),rgba(248,250,252,0.25))]" />
    <div className="mb-4">
      <Link
        to="/documents"
        className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.55)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to Documents
      </Link>
    </div>

    <PageHeader
      title={document.title}
      subtitle={`${document.flashcardCount || 0} flashcard set | ${document.quizCount || 0} quiz`}
    >
      <div className="grid grid-cols-2 gap-3 sm:flex">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-left">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-emerald-600">
            Status
          </p>
          <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
            {document.status || "ready"}
          </p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-sky-50/80 px-4 py-3 text-left">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-sky-600">
            Size
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {document.fileSize
              ? `${(document.fileSize / (1024 * 1024)).toFixed(2)} MB`
              : "Unknown"}
          </p>
        </div>
      </div>
    </PageHeader>

    <div className="mb-6 grid gap-4 lg:grid-cols-3">
      <div className="rounded-[1.5rem] border border-white/70 bg-white/85 p-4 shadow-[0_22px_55px_-38px_rgba(15,23,42,0.45)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Document
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {document.fileName || "PDF attached"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-white/70 bg-white/85 p-4 shadow-[0_22px_55px_-38px_rgba(15,23,42,0.45)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Flashcards
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {document.flashcardCount || 0} set ready
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-white/70 bg-white/85 p-4 shadow-[0_22px_55px_-38px_rgba(15,23,42,0.45)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Quizzes
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {document.quizCount || 0} available
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="rounded-[2rem] border border-white/70 bg-white/55 p-3 shadow-[0_28px_70px_-44px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-4">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  </div>
);
};

export default DocumentDetailPage;
