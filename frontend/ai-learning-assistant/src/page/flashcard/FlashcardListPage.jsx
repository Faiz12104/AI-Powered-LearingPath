import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { BookOpen, FileText, Star, Trash2 } from "lucide-react";
import flashcardService from "../../services/flashcardService";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import PageHeader from "../../components/common/PageHeader";

const FlashcardListPage = () => {
  const { id: documentId } = useParams();
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const visibleSets = useMemo(() => {
    if (!documentId) {
      return sets;
    }

    return sets.filter((set) => set.documentId?._id === documentId);
  }, [documentId, sets]);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await flashcardService.getAllFlashcardSets();
        setSets(response?.data || []);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to fetch flashcard sets.");
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await flashcardService.deleteFlashcardSet(id);
      setSets((prev) => prev.filter((set) => set._id !== id));
      toast.success("Flashcard set deleted.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to delete flashcard set.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Flashcard Library"
        subtitle="Apne generated flashcard sets ko review aur manage karo."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[1.5rem] border border-white/70 bg-white/85 p-4 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
            Total Sets
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {visibleSets.length}
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/70 bg-white/85 p-4 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
            Total Cards
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {visibleSets.reduce((total, set) => total + (set.cards?.length || 0), 0)}
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/70 bg-white/85 p-4 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-500">
            Starred
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {visibleSets.reduce(
              (total, set) =>
                total + (set.cards?.filter((card) => card.isStarred).length || 0),
              0
            )}
          </p>
        </div>
      </div>

      {visibleSets.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-white/90 px-6 py-12 text-center shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)]">
          <BookOpen className="mx-auto mb-4 text-slate-300" size={32} />
          <p className="text-sm font-medium text-slate-700">
            Koi flashcard set available nahi hai.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Kisi document ke andar jaa kar flashcards generate karo.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleSets.map((set) => {
            const starredCount =
              set.cards?.filter((card) => card.isStarred).length || 0;

            return (
              <div
                key={set._id}
                className="rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
                      Flashcard Set
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">
                      {set.documentId?.title || "Untitled Document"}
                    </h3>
                    <div className="mt-3 space-y-2 text-sm text-slate-500">
                      <p className="flex items-center gap-2">
                        <FileText size={16} />
                        {set.cards?.length || 0} cards
                      </p>
                      <p className="flex items-center gap-2">
                        <Star size={16} />
                        {starredCount} starred
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <Link
                    to={`/documents/${set.documentId?._id}/flashcard/${set._id}`}
                    className="flex-1"
                  >
                    <Button className="w-full">Open Set</Button>
                  </Link>

                  <Button
                    variant="outline"
                    disabled={deletingId === set._id}
                    onClick={() => handleDelete(set._id)}
                    className="px-4 text-red-500"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FlashcardListPage;
