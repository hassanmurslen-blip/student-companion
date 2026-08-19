"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // Math ki styling ke liye zaroori CSS

interface Message {
    id: string;
    sender: "user" | "ai";
    text: string;
    time: string;
}

const QUICK_PROMPTS = [
    {
        icon: "💡",
        title: "Explain a Concept",
        prompt: "Can you explain Photosynthesis in simple terms with an example?",
    },
    {
        icon: "📝",
        title: "Generate Quiz",
        prompt: "Create a 5-question multiple-choice quiz on basic Calculus derivatives.",
    },
    {
        icon: "⚡",
        title: "Summarize Notes",
        prompt: "Summarize key points about the Cold War for a quick revision.",
    },
    {
        icon: "🎯",
        title: "Study Schedule",
        prompt: "Help me create a 3-day revision plan for my upcoming Economics exam.",
    },
];

export default function AssistantPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeMode, setActiveMode] = useState<"tutor" | "quiz">("tutor");

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            sender: "ai",
            text: "Hello! 👋 I'm your StudyMate AI Tutor powered by Gemini. What topic are we tackling today?",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSend = async (textToSend?: string) => {
        const query = textToSend || input;
        if (!query.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: "user",
            text: query,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, userMsg]);
        if (!textToSend) setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: query, mode: activeMode }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Server error occurred");
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: "ai",
                text: data.text,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch (err: any) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: "ai",
                text: `⚠️ Error: ${err.message || "Failed to get response from Gemini."}`,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-gray-900 flex flex-col">
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shrink-0">
                <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            S
                        </div>
                        <div>
                            <p className="font-bold text-lg leading-none">StudyMate</p>
                            <p className="text-[10px] text-gray-400 mt-1">STUDENT COMPANION</p>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
                        <Link href="/" className="hover:text-indigo-600 transition">Dashboard</Link>
                        <Link href="/deadlines" className="hover:text-indigo-600 transition">Deadlines</Link>
                        <Link href="/timer" className="hover:text-indigo-600 transition">Focus</Link>
                        <Link href="/assistant" className="text-indigo-600">AI Tutor</Link>
                    </div>

                    <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex-1 flex flex-col w-full">
                <div className="bg-gray-900 text-white rounded-2xl p-5 md:p-6 mb-6 relative overflow-hidden shrink-0">
                    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-medium mb-2 text-indigo-300">
                                ✨ Gemini 2.5 Powered
                            </span>
                            <h1 className="text-xl md:text-2xl font-bold">StudyMate AI Tutor</h1>
                        </div>

                        <div className="flex bg-white/10 p-1 rounded-xl gap-1 shrink-0">
                            <button
                                onClick={() => setActiveMode("tutor")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeMode === "tutor" ? "bg-indigo-600 text-white" : "text-gray-300 hover:text-white"
                                    }`}
                            >
                                🤖 Explanation
                            </button>
                            <button
                                onClick={() => setActiveMode("quiz")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeMode === "quiz" ? "bg-indigo-600 text-white" : "text-gray-300 hover:text-white"
                                    }`}
                            >
                                📝 Quiz Bot
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-sm min-h-[500px]">
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 max-w-[85%] sm:max-w-[80%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold ${msg.sender === "user" ? "bg-indigo-600 text-white" : "bg-purple-100 text-purple-700"
                                        }`}
                                >
                                    {msg.sender === "user" ? "U" : "🤖"}
                                </div>

                                <div>
                                    <div
                                        className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === "user"
                                                ? "bg-indigo-600 text-white rounded-tr-none"
                                                : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200/60"
                                            }`}
                                    >
                                        {msg.sender === "ai" ? (
                                            <div className="space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_h3]:font-bold [&_h3]:text-base [&_h3]:mt-3 prose prose-sm max-w-none prose-p:leading-relaxed overflow-x-auto">
                                                {/* Yahan humne Math aur KaTeX plugins add kar diye hain */}
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkMath]}
                                                    rehypePlugins={[rehypeKatex]}
                                                >
                                                    {msg.text}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            msg.text
                                        )}
                                    </div>
                                    <p className={`text-[10px] text-gray-400 mt-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3 mr-auto">
                                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 text-sm font-bold">
                                    🤖
                                </div>
                                <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none text-sm border border-gray-200/60 flex items-center gap-2 text-gray-500">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 md:p-4 border-t border-gray-200 bg-white">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask anything about your subjects..."
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-semibold text-sm transition shrink-0 flex items-center gap-1 shadow-sm"
                            >
                                <span>Send</span>
                                <span>→</span>
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}