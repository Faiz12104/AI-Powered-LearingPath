import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BookOpen,
  BrainCircuit,
  Clock,
  FileText,
  TrendingUp,
} from "lucide-react";
import Spinner from "../../components/common/Spinner";
import PageHeader from "../../components/common/PageHeader";
import progressService from "../../services/progressService";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData();
        setDashboardData(data.data);
      } catch (error) {
        toast.error("Failed to fetch dashboard data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-[2rem] border border-white/70 bg-white/90 px-8 py-10 text-center shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900/90">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            <TrendingUp size={24} />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            No dashboard data available.
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Documents",
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
      gradient: "from-blue-400 to-cyan-500",
    },
    {
      label: "Total Flashcards",
      value: dashboardData.overview.totalFlashcards,
      icon: BookOpen,
      gradient: "from-fuchsia-400 to-pink-500",
    },
    {
      label: "Total Quizzes",
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
      gradient: "from-emerald-400 to-teal-500",
    },
  ];

  const activities = [
    ...(dashboardData.recentActivity?.documents || []).map((doc) => ({
      id: doc._id,
      description: doc.title,
      timestamp: doc.lastAccessed,
      link: `/documents/${doc._id}`,
      type: "document",
    })),
    ...(dashboardData.recentActivity?.quizzes || []).map((quiz) => ({
      id: quiz._id,
      description: quiz.title,
      timestamp: quiz.lastAttempted,
      link: `/quizzes/${quiz._id}`,
      type: "quiz",
    })),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Track your learning progress, material coverage, and recent activity in one place."
      >
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-300">
            Progress Snapshot
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
            {dashboardData.overview.totalDocuments} docs in workspace
          </p>
        </div>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900/90"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}
              >
                <stat.icon size={24} strokeWidth={2.2} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900/90 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Activity
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Latest documents accessed aur quizzes attempted.
            </p>
          </div>
        </div>

        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-4 transition hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950/70 dark:hover:border-slate-700"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-2 h-2.5 w-2.5 rounded-full ${
                      activity.type === "document"
                        ? "bg-blue-500"
                        : "bg-emerald-500"
                    }`}
                  />

                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {activity.type === "document"
                        ? "Accessed Document:"
                        : "Attempted Quiz:"}{" "}
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {activity.description}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                {activity.link && (
                  <Link
                    to={activity.link}
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-300 dark:hover:text-emerald-200"
                  >
                    View
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-950/50">
            <Clock className="mx-auto mb-3 text-slate-400 dark:text-slate-500" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No recent activity yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
