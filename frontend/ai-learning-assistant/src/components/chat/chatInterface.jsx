import React, { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import MarkdownRenderer from "../common/MarkdownRenderer";

const ChatInterface = () => {
  const { id: documentId } = useParams();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      if (!documentId) {
        setLoadingHistory(false);
        return;
      }

      try {
        const response = await aiService.getChatHistory(documentId);
        setMessages(response?.data || []);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to load chat history.");
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
  }, [documentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || !documentId || sending) {
      return;
    }

    const userMessage = {
      role: "user",
      content: trimmedQuestion,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setSending(true);

    try {
      const response = await aiService.chat(documentId, trimmedQuestion);
      const assistantMessage = {
        role: "assistant",
        content: response?.data?.answer || "No response received.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to send message.");
      setMessages((prev) => prev.filter((message) => message !== userMessage));
      setQuestion(trimmedQuestion);
    } finally {
      setSending(false);
    }
  };

  if (loadingHistory) {
    return <Spinner />;
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/85 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.45)] backdrop-blur-xl">
      <div className="border-b border-slate-200/80 bg-[linear-gradient(135deg,rgba(240,253,250,0.95),rgba(255,255,255,0.92))] px-4 py-4 sm:px-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200/80">
            <Sparkles size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
              Ask About This Document
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Summary, concepts, definitions, ya specific section ke baare me pucho.
            </p>
          </div>
        </div>
      </div>

      <div className="max-h-[58vh] space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top,#f8fffc_0%,#f8fafc_48%,#f8fafc_100%)] px-3 py-4 sm:px-5 sm:py-5">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-white/95 px-5 py-10 text-center shadow-[0_16px_40px_-34px_rgba(15,23,42,0.5)] sm:px-6 sm:py-12">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <MessageSquare size={20} />
            </div>
            <p className="text-sm font-medium text-slate-700">
              Start the conversation
            </p>
            <p className="mt-1 max-w-md text-sm text-slate-500">
              Example: "Is document ka main idea kya hai?" ya "Page se recursion simple words me samjhao."
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isAssistant = message.role === "assistant";

            return (
              <div
                key={`${message.timestamp || "message"}-${index}`}
                className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[92%] rounded-[1.5rem] px-4 py-3 text-sm leading-7 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.55)] sm:max-w-[82%] ${
                    isAssistant
                      ? "bg-white text-slate-700 border border-slate-200"
                      : "bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
                  }`}
                >
                  {isAssistant ? (
                    <MarkdownRenderer
                      content={message.content}
                      className="[&_p]:text-slate-700 [&_strong]:text-slate-900"
                    />
                  ) : (
                    <p className="whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}

        {sending && (
          <div className="flex justify-start">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.55)]">
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-slate-200/80 bg-white/95 p-3 sm:p-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask a question about this document..."
            rows={3}
            className="min-h-[92px] w-full flex-1 resize-none rounded-[1.5rem] border border-slate-200 bg-slate-50/75 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          />

          <button
            type="submit"
            disabled={sending || !question.trim()}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-200/80 transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-auto"
          >
            <Send size={16} />
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
