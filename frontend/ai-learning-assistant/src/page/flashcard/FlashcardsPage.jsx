import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Star,
} from "lucide-react";
import flashcardService from "../../services/flashcardService";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";

const FlashcardsPage = () => {
  const { id: documentId, flashcardId } = useParams();
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const fetchSet = async () => {
      try {
        const response = await flashcardService.getFlashcardsForDocument(documentId);
        const matchingSet = (response?.data || []).find(
          (set) => set._id === flashcardId
        );

        if (!matchingSet) {
          toast.error("Flashcard set not found.");
          return;
        }

        setFlashcardSet(matchingSet);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to fetch flashcard set.");
      } finally {
        setLoading(false);
      }
    };

    fetchSet();
  }, [documentId, flashcardId]);

  const currentCard = useMemo(
    () => flashcardSet?.cards?.[currentIndex] || null,
    [flashcardSet, currentIndex]
  );

  const handleReview = async () => {
    if (!currentCard) return;

    try {
      const response = await flashcardService.reviewFlashcard(currentCard._id);
      setFlashcardSet(response?.data || flashcardSet);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update review count.");
    }
  };

  const handleToggleStar = async () => {
    if (!currentCard) return;

    try {
      const response = await flashcardService.toggleStar(currentCard._id);
      setFlashcardSet(response?.data || flashcardSet);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to toggle star.");
    }
  };

  const goToCard = (nextIndex) => {
    setCurrentIndex(nextIndex);
    setShowAnswer(false);
  };

  if (loading) {
    return <Spinner />;
  }

  if (!flashcardSet || !currentCard) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
        Flashcard set not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to={`/documents/${documentId}`}
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to Document
      </Link>

      <div className="rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
              Flashcard Viewer
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              {flashcardSet.documentId?.title || "Flashcards"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Card {currentIndex + 1} of {flashcardSet.cards.length}
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleStar}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${
              currentCard.isStarred
                ? "bg-amber-50 text-amber-600"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <Star size={16} fill={currentCard.isStarred ? "currentColor" : "none"} />
            {currentCard.isStarred ? "Starred" : "Star"}
          </button>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <button
            type="button"
            onClick={() => setShowAnswer((prev) => !prev)}
            className="min-h-72 rounded-[1.75rem] border border-white/70 bg-gradient-to-br from-white to-slate-50 p-5 text-left shadow-[0_20px_50px_-38px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 sm:p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Question
            </p>
            <p className="mt-6 text-xl font-semibold leading-9 text-slate-900">
              {currentCard.question}
            </p>
            <p className="mt-10 text-sm text-slate-400">
              Tap to {showAnswer ? "hide" : "reveal"} answer
            </p>
          </button>

          <div className="min-h-72 rounded-[1.75rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.45)] sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
              Answer
            </p>
            {showAnswer ? (
              <p className="mt-6 whitespace-pre-wrap text-base leading-8 text-slate-700">
                {currentCard.answer}
              </p>
            ) : (
              <div className="mt-10 rounded-2xl border border-dashed border-emerald-200 bg-white/80 px-6 py-8 text-center text-sm text-slate-500">
                Answer reveal karne ke liye question card par click karo.
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-500">
            Difficulty:{" "}
            <span className="font-semibold text-slate-700 capitalize">
              {currentCard.difficulty}
            </span>
            {" • "}Reviewed {currentCard.reviewCount || 0} times
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => goToCard(Math.max(currentIndex - 1, 0))}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={16} />
              Previous
            </Button>

            <Button
              variant="secondary"
              onClick={handleReview}
            >
              <RotateCcw size={16} />
              Mark Reviewed
            </Button>

            <Button
              onClick={() =>
                goToCard(
                  Math.min(currentIndex + 1, flashcardSet.cards.length - 1)
                )
              }
              disabled={currentIndex === flashcardSet.cards.length - 1}
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsPage;
