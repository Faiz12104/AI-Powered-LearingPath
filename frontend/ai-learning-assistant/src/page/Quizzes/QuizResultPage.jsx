import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import quizService from "../../services/quizService";
import Spinner from "../../components/common/Spinner";

const QuizResultPage = () => {
  const { quizId } = useParams();
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await quizService.getQuizResults(quizId);
        setResultsData(response?.data || null);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to fetch quiz results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) {
    return <Spinner />;
  }

  if (!resultsData) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
        Quiz results not found.
      </div>
    );
  }

  const { quiz, results } = resultsData;
  const correctCount = results.filter((item) => item.isCorrect).length;

  return (
    <div className="space-y-6">
      <Link
        to={`/documents/${quiz.document?._id || ""}`}
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to Document
      </Link>

      <div className="rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
          Quiz Result
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          {quiz.document?.title || "Quiz Results"}
        </h1>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] bg-slate-50/90 p-5">
            <p className="text-sm text-slate-500">Score</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {quiz.score}%
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50/90 p-5">
            <p className="text-sm text-slate-500">Correct</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {correctCount}/{quiz.totalQuestions}
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50/90 p-5">
            <p className="text-sm text-slate-500">Completed At</p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {new Date(quiz.completedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {results.map((item) => (
            <div
              key={item.questionIndex}
              className="rounded-[1.75rem] border border-white/70 bg-white/75 p-5 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Question {item.questionIndex + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {item.question}
                  </h3>
                </div>

                {item.isCorrect ? (
                  <CheckCircle2 className="text-emerald-500" />
                ) : (
                  <XCircle className="text-red-500" />
                )}
              </div>

              <div className="mt-4 grid gap-2">
                {item.options.map((option) => {
                  const isCorrectAnswer = option === item.correctAnswer;
                  const isSelected = option === item.selectedAnswer;

                  return (
                    <div
                      key={option}
                      className={`rounded-xl border px-4 py-3 text-sm ${
                        isCorrectAnswer
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : isSelected
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      {option}
                    </div>
                  );
                })}
              </div>

              {item.explanation && (
                <div className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-slate-700">
                  <span className="font-semibold text-blue-700">Explanation:</span>{" "}
                  {item.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;
