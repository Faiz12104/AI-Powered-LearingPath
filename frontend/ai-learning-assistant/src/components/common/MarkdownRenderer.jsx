import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({ content = "", className = "" }) => {
  return (
    <div
      className={[
        "prose prose-slate max-w-none prose-p:leading-7 prose-pre:p-0 prose-code:before:content-none prose-code:after:content-none",
        className,
      ].join(" ")}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className: codeClassName, children, ...props }) {
            const code = String(children).replace(/\n$/, "");

            if (!inline) {
              return (
                <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-100 dark:bg-slate-900" {...props}>
                  <code className={codeClassName}>{code}</code>
                </pre>
              );
            }

            return (
              <code
                className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-slate-800"
                {...props}
              >
                {children}
              </code>
            );
          },
          a({ ...props }) {
            return (
              <a
                {...props}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 underline decoration-emerald-300 underline-offset-4"
              />
            );
          },
          blockquote({ ...props }) {
            return (
              <blockquote
                {...props}
                className="border-l-4 border-emerald-200 bg-emerald-50/50 px-4 py-2 text-slate-700"
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
