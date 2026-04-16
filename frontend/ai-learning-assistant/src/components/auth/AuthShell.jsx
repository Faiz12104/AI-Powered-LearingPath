import React from "react";
import { BrainCircuit, MoonStar, Sparkles, SunMedium } from "lucide-react";
import { useTheme } from "../../context/themeContext";

const AuthShell = ({ title, subtitle, children, footer }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.16),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_28%)]" />

      <button
        type="button"
        onClick={toggleTheme}
        className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-slate-700 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.6)] backdrop-blur-xl transition hover:-translate-y-0.5 dark:border-slate-700/70 dark:bg-slate-900/80 dark:text-slate-100 sm:right-6 sm:top-6"
        aria-label="Toggle theme"
      >
        {isDark ? <SunMedium size={18} /> : <MoonStar size={18} />}
      </button>

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.55)] backdrop-blur-2xl dark:border-slate-700/70 dark:bg-slate-950/75 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden border-r border-white/60 bg-[linear-gradient(180deg,rgba(16,185,129,0.12),rgba(255,255,255,0.5))] p-10 dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(16,185,129,0.14),rgba(15,23,42,0.35))] lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200/80 dark:shadow-emerald-900/40">
              <BrainCircuit size={28} />
            </div>

            <h2 className="mt-8 text-4xl font-semibold leading-tight text-slate-900 dark:text-white">
              Learn faster with your AI study workspace.
            </h2>

            <p className="mt-4 max-w-md text-base leading-8 text-slate-600 dark:text-slate-300">
              PDFs ko upload karo, chat se samjho, flashcards banao, quizzes do,
              aur apni revision ko structured flow me rakho.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              "Document chat with context-aware answers",
              "One-click summaries, flashcards, and quizzes",
              "Responsive dashboard for desktop and mobile",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/75 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <Sparkles size={18} />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="inline-flex h-13 w-13 items-center justify-center rounded-[1.35rem] bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200/80 dark:shadow-emerald-900/40">
                <BrainCircuit size={24} />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-300">
                AI Learning Assistant
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-[2.35rem]">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-300">
                {subtitle}
              </p>
            </div>

            <div className="mt-8">{children}</div>

            {footer && (
              <div className="mt-6 text-sm text-slate-500 dark:text-slate-300">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
