import React from "react";
import { useAuth } from "../../context/authContext";
import { Bell, User, Menu, MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "../../context/themeContext";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/60 bg-white/70 backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-950/70">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-white/90 text-slate-600 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:flex md:items-center md:gap-3">
          <div className="rounded-full border border-emerald-100 bg-emerald-50/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            Learning Workspace
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-white/90 text-slate-600 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            {isDark ? <SunMedium size={18} /> : <MoonStar size={18} />}
          </button>

          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-white/90 text-slate-600 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            <Bell
              size={20}
              strokeWidth={2}
              className="group-hover:scale-110 transition-transform duration-200"
            />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 border-l border-slate-200/60 pl-3">
            <div className="flex items-center gap-3 rounded-[1.25rem] border border-white/70 bg-white/90 px-3 py-2 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.45)] transition dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500">
                <User size={18} strokeWidth={2.5} className="text-white" />
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
