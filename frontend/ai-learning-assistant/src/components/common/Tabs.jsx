import React from "react";

const Tabs = ({ tabs = [], activeTab, setActiveTab }) => {
  const selectedTab =
    tabs.find((tab) => tab.name === activeTab) || tabs[0] || null;

  if (!selectedTab) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="rounded-[1.75rem] border border-white/60 bg-white/80 p-2 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl">
        <nav
          className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Tabs"
        >
          {tabs.map((tab) => {
            const isActive = selectedTab.name === tab.name;

            return (
              <button
                key={tab.name}
                type="button"
                onClick={() => setActiveTab(tab.name)}
                className={`relative shrink-0 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 sm:px-5 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200/80"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-5 sm:pt-6">{selectedTab.content}</div>
    </div>
  );
};

export default Tabs;
