import React from "react";

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-[1.75rem] border border-white/60 bg-white/80 px-5 py-5 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[2rem]">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[0.95rem]">
            {subtitle}
          </p>
        )}
      </div>

      {children && (
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
