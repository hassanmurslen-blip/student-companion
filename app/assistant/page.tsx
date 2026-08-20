"use client";

import {
    ArrowLeft, BookOpen, Bot, Brain, ChevronRight, ClipboardList, Eraser,
    Lightbulb, Menu, Moon, Plus, Send, Sparkles, Sun,
    Target, User, X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

type Mode = "tutor" | "quiz";
interface Message { id: string; sender: "user" | "ai"; text: string; time: string; }

const STORAGE_KEY = "studentmate-ai-chat";
const welcomeMessage = (): Message => ({
    id: crypto.randomUUID(), sender: "ai",
    text: "Hi! I’m your **StudentMate AI Tutor**. Ask me to explain a topic, solve a problem step by step, summarize notes, or prepare a quiz.",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
});

const prompts = [
    { icon: <Lightbulb size={18} />, title: "Explain simply", text: "Explain photosynthesis in simple terms with a real-life example.", tint: "violet" },
    { icon: <ClipboardList size={18} />, title: "Create a quiz", text: "Create a 5-question multiple-choice quiz on calculus derivatives.", tint: "blue" },
    { icon: <BookOpen size={18} />, title: "Summarize notes", text: "Summarize the key points of the Cold War for quick revision.", tint: "emerald" },
    { icon: <Target size={18} />, title: "Build a plan", text: "Create a focused 3-day revision plan for an economics exam.", tint: "pink" },
];

const lightTheme = {
    "--app-bg": "#f7f7ff", "--surface": "#ffffff", "--surface-2": "#f3f1ff",
    "--text": "#211d35", "--muted": "#77738a", "--border": "#e8e5f2",
    "--shadow": "0 18px 55px rgba(83,63,140,.1)",
} as CSSProperties;
const darkTheme = {
    "--app-bg": "#0d0b17", "--surface": "#171421", "--surface-2": "#211c30",
    "--text": "#f4f1ff", "--muted": "#aaa4bc", "--border": "#2e2940",
    "--shadow": "0 20px 60px rgba(0,0,0,.32)",
} as CSSProperties;

export default function AssistantPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<Mode>("tutor");
    const [mobilePanel, setMobilePanel] = useState(false);
    const [dark, setDark] = useState(false);
    const [ready, setReady] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem("studentmate-theme");
        setDark(savedTheme ? savedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            setMessages(saved ? JSON.parse(saved) : [welcomeMessage()]);
        } catch { setMessages([welcomeMessage()]); }
        setReady(true);
    }, []);

    useEffect(() => { if (ready && messages.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); }, [messages, ready]);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

    const newChat = () => { setMessages([welcomeMessage()]); setInput(""); setMobilePanel(false); inputRef.current?.focus(); };

    const sendMessage = async (preset?: string) => {
        const query = (preset ?? input).trim();
        if (!query || loading) return;
        const userMessage: Message = { id: crypto.randomUUID(), sender: "user", text: query, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
        setMessages((current) => [...current, userMessage]); setInput(""); setLoading(true);
        try {
            const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: query, mode }) });
            const data: { text?: string; error?: string } = await response.json();
            if (!response.ok) throw new Error(data.error || "The assistant could not respond.");
            setMessages((current) => [...current, { id: crypto.randomUUID(), sender: "ai", text: data.text || "No response received.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to connect to the AI service.";
            setMessages((current) => [...current, { id: crypto.randomUUID(), sender: "ai", text: `⚠️ **Something went wrong:** ${message}`, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
        } finally { setLoading(false); inputRef.current?.focus(); }
    };

    const submit = (event: FormEvent) => { event.preventDefault(); void sendMessage(); };
    const toggleTheme = () => setDark((value) => { localStorage.setItem("studentmate-theme", value ? "light" : "dark"); return !value; });

    return (
        <div style={dark ? darkTheme : lightTheme} className="flex min-h-screen flex-col bg-[var(--app-bg)] text-[var(--text)] transition-colors duration-300">
            <header className="z-40 border-b border-[var(--border)] bg-[var(--app-bg)]/90 px-4 py-3 backdrop-blur-xl sm:px-6"><div className="mx-auto flex max-w-7xl items-center justify-between"><Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-lg shadow-purple-500/20"><Sparkles size={18} /></span><span className="hidden sm:block"><strong className="block text-sm">StudentMate</strong><small className="text-[10px] text-[var(--muted)]">AI learning studio</small></span></Link><div className="flex items-center gap-2"><Link href="/" className="flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold"><ArrowLeft size={16} /><span className="hidden sm:inline">Dashboard</span></Link><button onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)]">{ready && (dark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-violet-500" />)}</button><button onClick={() => setMobilePanel(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] lg:hidden"><Menu size={18} /></button></div></div></header>

            <main className="mx-auto flex w-full max-w-7xl flex-1 gap-5 overflow-hidden p-4 sm:p-6">
                <aside className="hidden w-72 shrink-0 flex-col rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-4 lg:flex"><SidePanel mode={mode} setMode={setMode} newChat={newChat} clear={() => setMessages([welcomeMessage()])} /></aside>

                <section style={{ boxShadow: "var(--shadow)" }} className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)]">
                    <div className="relative overflow-hidden border-b border-[var(--border)] bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 p-5 text-white sm:p-6"><div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" /><div className="relative flex items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15"><Bot size={22} /></span><div><div className="flex items-center gap-2"><h1 className="font-black sm:text-lg">AI Student Assistant</h1><span className="h-2 w-2 rounded-full bg-emerald-300 ring-4 ring-emerald-300/20" /></div><p className="mt-0.5 text-xs text-white/65">{mode === "tutor" ? "Tutor mode · Clear step-by-step help" : "Quiz mode · Active recall practice"}</p></div></div><button onClick={newChat} className="hidden items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-xs font-bold sm:flex"><Plus size={15} /> New chat</button></div></div>

                    <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
                        {messages.length <= 1 && <div className="mx-auto mb-8 max-w-2xl"><div className="text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-500/15 text-violet-500"><Brain size={25} /></span><h2 className="mt-4 text-xl font-black">What would you like to learn?</h2><p className="mt-2 text-sm text-[var(--muted)]">Choose a starting point or ask your own question below.</p></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{prompts.map((prompt) => <button key={prompt.title} onClick={() => void sendMessage(prompt.text)} className="group flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left transition hover:-translate-y-0.5 hover:border-violet-400"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${prompt.tint === "violet" ? "bg-violet-500/15 text-violet-500" : prompt.tint === "blue" ? "bg-blue-500/15 text-blue-500" : prompt.tint === "emerald" ? "bg-emerald-500/15 text-emerald-500" : "bg-pink-500/15 text-pink-500"}`}>{prompt.icon}</span><span className="min-w-0 flex-1"><strong className="block text-sm">{prompt.title}</strong><small className="mt-1 block truncate text-[var(--muted)]">{prompt.text}</small></span><ChevronRight size={15} className="text-[var(--muted)] transition group-hover:translate-x-1" /></button>)}</div></div>}

                        <div className="mx-auto max-w-3xl space-y-5">{messages.map((message) => <div key={message.id} className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${message.sender === "user" ? "bg-gradient-to-br from-violet-600 to-pink-500 text-white" : "bg-violet-500/15 text-violet-500"}`}>{message.sender === "user" ? <User size={16} /> : <Bot size={18} />}</span><div className={`max-w-[85%] ${message.sender === "user" ? "text-right" : ""}`}><div className={`inline-block rounded-2xl px-4 py-3 text-left text-sm leading-6 ${message.sender === "user" ? "rounded-tr-md bg-gradient-to-r from-violet-600 to-purple-500 text-white" : "rounded-tl-md border border-[var(--border)] bg-[var(--surface-2)]"}`}>{message.sender === "ai" ? <div className="ai-markdown"><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{message.text}</ReactMarkdown></div> : message.text}</div><p className="mt-1 px-1 text-[10px] text-[var(--muted)]">{message.time}</p></div></div>)}{loading && <div className="flex gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500/15 text-violet-500"><Bot size={18} /></span><span className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-[var(--surface-2)] px-4 py-4"><i className="h-2 w-2 animate-bounce rounded-full bg-violet-500" /><i className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:.15s]" /><i className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:.3s]" /></span></div>}<div ref={endRef} /></div>
                    </div>

                    <div className="border-t border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4"><form onSubmit={submit} className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-2 focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-500/10"><textarea ref={inputRef} rows={1} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} placeholder={mode === "tutor" ? "Ask anything about your subjects..." : "Enter a topic for your quiz..."} className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm outline-none" /><button disabled={!input.trim() || loading} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 text-white shadow-md disabled:opacity-40"><Send size={17} /></button></form><p className="mt-2 text-center text-[10px] text-[var(--muted)]">AI can make mistakes. Verify important academic information.</p></div>
                </section>
            </main>

            {mobilePanel && <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setMobilePanel(false)}><aside className="h-full w-72 bg-[var(--surface)] p-4" onClick={(event) => event.stopPropagation()}><div className="mb-4 flex justify-end"><button onClick={() => setMobilePanel(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--surface-2)]"><X size={17} /></button></div><SidePanel mode={mode} setMode={(value) => { setMode(value); setMobilePanel(false); }} newChat={newChat} clear={() => setMessages([welcomeMessage()])} /></aside></div>}
            <style jsx global>{`.ai-markdown p{margin:.3rem 0}.ai-markdown h1,.ai-markdown h2,.ai-markdown h3{font-weight:800;margin:.75rem 0 .3rem}.ai-markdown ul{list-style:disc;padding-left:1.2rem;margin:.4rem 0}.ai-markdown ol{list-style:decimal;padding-left:1.2rem;margin:.4rem 0}.ai-markdown code{background:rgba(139,92,246,.12);border-radius:.35rem;padding:.1rem .3rem}.ai-markdown pre{overflow:auto;background:#171421;color:#f4f1ff;padding:1rem;border-radius:.8rem;margin:.6rem 0}.ai-markdown table{display:block;overflow:auto;border-collapse:collapse}.ai-markdown th,.ai-markdown td{border:1px solid var(--border);padding:.4rem .6rem}`}</style>
        </div>
    );
}

function SidePanel({ mode, setMode, newChat, clear }: { mode: Mode; setMode: (value: Mode) => void; newChat: () => void; clear: () => void }) {
    return <><button onClick={newChat} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 py-3 text-sm font-extrabold text-white shadow-lg shadow-purple-500/20"><Plus size={17} /> New conversation</button><div className="mt-6"><p className="px-2 text-[10px] font-extrabold uppercase tracking-[.18em] text-[var(--muted)]">Assistant mode</p><div className="mt-2 space-y-1"><ModeButton active={mode === "tutor"} onClick={() => setMode("tutor")} icon={<Brain size={18} />} title="AI Tutor" helper="Explain and solve" /><ModeButton active={mode === "quiz"} onClick={() => setMode("quiz")} icon={<ClipboardList size={18} />} title="Quiz Coach" helper="Test your knowledge" /></div></div><div className="mt-auto pt-6"><button onClick={clear} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-[var(--muted)] hover:bg-red-500/10 hover:text-red-500"><Eraser size={17} /> Clear conversation</button><div className="mt-3 rounded-2xl bg-[var(--surface-2)] p-4"><div className="flex items-center gap-2 text-xs font-bold"><Sparkles size={15} className="text-violet-500" /> Study smarter</div><p className="mt-2 text-xs leading-5 text-[var(--muted)]">Ask for examples, step-by-step reasoning, revision notes or practice questions.</p></div></div></>;
}
function ModeButton({ active, onClick, icon, title, helper }: { active: boolean; onClick: () => void; icon: ReactNode; title: string; helper: string }) { return <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${active ? "bg-violet-500/15 text-violet-500" : "text-[var(--muted)] hover:bg-[var(--surface-2)]"}`}><span>{icon}</span><span><strong className="block text-sm">{title}</strong><small className="text-[10px] opacity-70">{helper}</small></span></button>; }
