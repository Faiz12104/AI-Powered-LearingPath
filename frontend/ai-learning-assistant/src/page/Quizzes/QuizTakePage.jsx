import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import quizService from "../../services/quizService";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";

const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizService.getQuizById(quizId);
        const quizData = response?.data;

        if (quizData?.completedAt) {
          navigate(`/quizzes/${quizId}/results`, { replace: true });
          return;
        }

        setQuiz(quizData);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to fetch quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [navigate, quizId]);

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );

  const handleSelect = (questionIndex, option) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleSubmit = async () => {
    const preparedAnswers = Object.entries(answers).map(
      ([questionIndex, selectedAnswer]) => ({
        questionIndex: Number(questionIndex),
        selectedAnswer,
      })
    );

    if (preparedAnswers.length !== quiz.questions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      await quizService.submitQuiz(quizId, preparedAnswers);
      toast.success("Quiz submitted successfully.");
      navigate(`/quizzes/${quizId}/results`);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!quiz) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
        Quiz not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to={`/documents/${quiz.documentId}`}
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to Document
      </Link>

      <div className="rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
              Quiz
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              {quiz.title}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {answeredCount}/{quiz.questions.length} answered
            </p>
          </div>

          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        </div>

        <div className="space-y-5">
          {quiz.questions.map((question, index) => (
            <div
              key={index}
              className="rounded-[1.75rem] border border-white/70 bg-slate-50/80 p-4 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)] sm:p-5"
            >
              <p className="text-sm font-semibold text-slate-500">
                Question {index + 1}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                {question.question}
              </h3>

              <div className="mt-4 grid gap-3">
                {question.options.map((option) => {
                  const isSelected = answers[index] === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelect(index, option)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                        isSelected
                          ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizTakePage;
