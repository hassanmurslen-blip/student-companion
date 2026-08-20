"use client";

import {
    AlertCircle, ArrowLeft, Bell, BellRing, CalendarDays, Check, CheckCircle2,
    ChevronDown, Clock3, Edit3, Filter, Moon, Plus, Search, Sparkles, Sun,
    Trash2, X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";

type DeadlineType = "Assignment" | "Exam" | "Quiz" | "Project" | "Other";
type Priority = "Low" | "Medium" | "High";
type FilterValue = "All" | "Pending" | "Completed" | "Overdue";

interface Deadline {
    id: number; title: string; subject: string; type: DeadlineType;
    date: string; time: string; priority: Priority; completed: boolean;
}

const STORAGE_KEY = "studymate-deadlines";
const ALERTED_KEY = "studymate-deadline-alerts";
const emptyForm = { title: "", subject: "", type: "Assignment" as DeadlineType, date: "", time: "", priority: "Medium" as Priority };

const lightTheme = {
    "--app-bg": "#f7f7ff", "--surface": "#ffffff", "--surface-2": "#f3f1ff",
    "--text": "#211d35", "--muted": "#77738a", "--border": "#e8e5f2",
    "--shadow": "0 16px 45px rgba(83,63,140,.09)",
} as CSSProperties;
const darkTheme = {
    "--app-bg": "#0d0b17", "--surface": "#171421", "--surface-2": "#211c30",
    "--text": "#f4f1ff", "--muted": "#aaa4bc", "--border": "#2e2940",
    "--shadow": "0 18px 55px rgba(0,0,0,.3)",
} as CSSProperties;

const dueTimestamp = (item: Pick<Deadline, "date" | "time">) => {
    const time = item.time || "23:59";
    return new Date(`${item.date}T${time}:00`).getTime();
};

const relativeDue = (item: Deadline, now: number) => {
    const difference = dueTimestamp(item) - now;
    const absolute = Math.abs(difference);
    const minutes = Math.ceil(absolute / 60_000);
    const hours = Math.ceil(absolute / 3_600_000);
    const days = Math.ceil(absolute / 86_400_000);
    if (difference < 0) return minutes < 60 ? `${minutes}m overdue` : hours < 24 ? `${hours}h overdue` : `${days}d overdue`;
    if (minutes <= 1) return "Due now";
    if (minutes < 60) return `${minutes}m left`;
    if (hours < 24) return `${hours}h left`;
    return `${days}d left`;
};

export default function DeadlineTracker() {
    const [deadlines, setDeadlines] = useState<Deadline[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [filter, setFilter] = useState<FilterValue>("All");
    const [query, setQuery] = useState("");
    const [now, setNow] = useState(Date.now());
    const [toast, setToast] = useState<Deadline | null>(null);
    const [alertsEnabled, setAlertsEnabled] = useState(false);
    const [dark, setDark] = useState(false);
    const [ready, setReady] = useState(false);
    const audioContext = useRef<AudioContext | null>(null);
    const alertedIds = useRef<Set<number>>(new Set());

    const unlockAudio = useCallback(async () => {
        try {
            const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (!audioContext.current || audioContext.current.state === "closed") audioContext.current = new AudioCtx();
            if (audioContext.current.state === "suspended") await audioContext.current.resume();
            setAlertsEnabled(true);
        } catch { return; }
    }, []);

    const playAlert = useCallback(async () => {
        await unlockAudio();
        const ctx = audioContext.current;
        if (!ctx) return;
        [0, .2, .4, .75].forEach((delay, index) => {
            const oscillator = ctx.createOscillator(); const gain = ctx.createGain();
            oscillator.type = index === 3 ? "triangle" : "sine";
            oscillator.frequency.value = [740, 880, 740, 980][index];
            gain.gain.setValueAtTime(.0001, ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(.2, ctx.currentTime + delay + .02);
            gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + delay + .18);
            oscillator.connect(gain).connect(ctx.destination);
            oscillator.start(ctx.currentTime + delay); oscillator.stop(ctx.currentTime + delay + .2);
        });
    }, [unlockAudio]);

    useEffect(() => {
        const savedTheme = localStorage.getItem("studentmate-theme");
        setDark(savedTheme ? savedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setDeadlines(JSON.parse(saved));
            alertedIds.current = new Set(JSON.parse(localStorage.getItem(ALERTED_KEY) || "[]"));
        } catch { localStorage.removeItem(STORAGE_KEY); }
        setLoaded(true); setReady(true);
    }, []);

    useEffect(() => { if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(deadlines)); }, [deadlines, loaded]);
    useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 15_000); return () => window.clearInterval(timer); }, []);
    useEffect(() => () => { if (audioContext.current && audioContext.current.state !== "closed") void audioContext.current.close(); }, []);

    useEffect(() => {
        if (!loaded) return;
        const expired = deadlines.find((item) => !item.completed && dueTimestamp(item) <= now && !alertedIds.current.has(item.id));
        if (!expired) return;
        alertedIds.current.add(expired.id);
        localStorage.setItem(ALERTED_KEY, JSON.stringify([...alertedIds.current]));
        setToast(expired); void playAlert();
        if ("Notification" in window && Notification.permission === "granted") new Notification("Deadline exceeded", { body: `${expired.title} is now overdue.` });
    }, [deadlines, loaded, now, playAlert]);

    const enableAlerts = async () => {
        await unlockAudio();
        if ("Notification" in window && Notification.permission === "default") await Notification.requestPermission();
        void playAlert();
    };

    const saveDeadline = () => {
        if (!form.title.trim() || !form.date) return;
        void unlockAudio();
        if (editingId) {
            setDeadlines((current) => current.map((item) => item.id === editingId ? { ...item, ...form, title: form.title.trim(), subject: form.subject.trim() } : item));
            alertedIds.current.delete(editingId);
        } else setDeadlines((current) => [...current, { id: Date.now(), ...form, title: form.title.trim(), subject: form.subject.trim(), completed: false }]);
        setForm(emptyForm); setEditingId(null); setFormOpen(false);
    };

    const editDeadline = (item: Deadline) => {
        setForm({ title: item.title, subject: item.subject, type: item.type, date: item.date, time: item.time, priority: item.priority });
        setEditingId(item.id); setFormOpen(true); window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const counts = useMemo(() => ({
        pending: deadlines.filter((item) => !item.completed && dueTimestamp(item) > now).length,
        completed: deadlines.filter((item) => item.completed).length,
        overdue: deadlines.filter((item) => !item.completed && dueTimestamp(item) <= now).length,
    }), [deadlines, now]);

    const visible = useMemo(() => deadlines.filter((item) => {
        const matchesSearch = `${item.title} ${item.subject}`.toLowerCase().includes(query.toLowerCase());
        const matchesFilter = filter === "All" || (filter === "Pending" && !item.completed && dueTimestamp(item) > now) || (filter === "Completed" && item.completed) || (filter === "Overdue" && !item.completed && dueTimestamp(item) <= now);
        return matchesSearch && matchesFilter;
    }).sort((a, b) => Number(a.completed) - Number(b.completed) || dueTimestamp(a) - dueTimestamp(b)), [deadlines, filter, now, query]);

    const toggleTheme = () => setDark((value) => { localStorage.setItem("studentmate-theme", value ? "light" : "dark"); return !value; });

    return (
        <div style={dark ? darkTheme : lightTheme} className="min-h-screen bg-[var(--app-bg)] text-[var(--text)] transition-colors duration-300">
            <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--app-bg)]/90 px-4 py-4 backdrop-blur-xl sm:px-6"><div className="mx-auto flex max-w-6xl items-center justify-between"><Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-lg shadow-purple-500/20"><Sparkles size={18} /></span><span className="hidden sm:block"><strong className="block text-sm">StudentMate</strong><small className="text-[10px] text-[var(--muted)]">Academic planner</small></span></Link><div className="flex gap-2"><Link href="/" className="flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold"><ArrowLeft size={16} /><span className="hidden sm:inline">Dashboard</span></Link><button onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)]">{ready && (dark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-violet-500" />)}</button></div></div></header>

            <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:py-10">
                <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 p-7 text-white shadow-2xl shadow-purple-500/20 sm:p-9"><div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" /><div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[.2em] text-white/65">Academic planner</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Never miss a deadline.</h1><p className="mt-2 max-w-xl text-sm text-white/75">Track assignments, exams and projects with precise due-time alerts.</p></div><div className="flex flex-wrap gap-2"><button onClick={enableAlerts} className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm font-bold backdrop-blur"><BellRing size={17} />{alertsEnabled ? "Alerts enabled" : "Enable alerts"}</button><button onClick={() => { setForm(emptyForm); setEditingId(null); setFormOpen(true); }} className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-violet-600"><Plus size={17} /> Add deadline</button></div></div></section>

                <section className="mt-6 grid grid-cols-3 gap-3"><Stat label="Pending" value={counts.pending} color="text-violet-500" icon={<Clock3 size={18} />} /><Stat label="Completed" value={counts.completed} color="text-emerald-500" icon={<CheckCircle2 size={18} />} /><Stat label="Overdue" value={counts.overdue} color="text-red-500" icon={<AlertCircle size={18} />} /></section>

                {formOpen && <section style={{ boxShadow: "var(--shadow)" }} className="mt-6 rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-lg font-black">{editingId ? "Edit deadline" : "Add new deadline"}</h2><p className="mt-1 text-xs text-[var(--muted)]">Date-only deadlines expire at 11:59 PM.</p></div><button onClick={() => setFormOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--surface-2)]"><X size={17} /></button></div><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Field label="Title *"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Database assignment" className="field" /></Field><Field label="Subject"><input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Database Systems" className="field" /></Field><Field label="Type"><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as DeadlineType })} className="field">{["Assignment", "Exam", "Quiz", "Project", "Other"].map((value) => <option key={value}>{value}</option>)}</select></Field><Field label="Due date *"><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="field" /></Field><Field label="Due time"><input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="field" /></Field><Field label="Priority"><select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })} className="field"><option>Low</option><option>Medium</option><option>High</option></select></Field></div>{(!form.title.trim() || !form.date) && <p className="mt-4 text-xs text-[var(--muted)]">Title and due date are required.</p>}<button disabled={!form.title.trim() || !form.date} onClick={saveDeadline} className="mt-5 w-full rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40">{editingId ? "Save changes" : "Create deadline"}</button></section>}

                <section className="mt-7"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-black">Your deadlines</h2><p className="mt-1 text-sm text-[var(--muted)]">{deadlines.length} items saved on this device</p></div><div className="flex gap-2"><label className="flex flex-1 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 sm:w-56"><Search size={16} className="text-[var(--muted)]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none" /></label><label className="relative flex items-center"><Filter size={15} className="pointer-events-none absolute left-3 text-[var(--muted)]" /><select value={filter} onChange={(e) => setFilter(e.target.value as FilterValue)} className="appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-9 pr-8 text-sm font-bold outline-none"><option>All</option><option>Pending</option><option>Completed</option><option>Overdue</option></select><ChevronDown size={14} className="pointer-events-none absolute right-3" /></label></div></div>

                    {visible.length === 0 ? <div className="mt-5 rounded-[1.75rem] border border-dashed border-[var(--border)] bg-[var(--surface)] p-12 text-center"><CalendarDays size={30} className="mx-auto text-violet-400" /><p className="mt-3 font-extrabold">No deadlines found</p><p className="mt-1 text-sm text-[var(--muted)]">Add a task or change your current filter.</p></div> : <div className="mt-5 grid gap-3">{visible.map((item) => { const overdue = !item.completed && dueTimestamp(item) <= now; return <article key={item.id} className={`rounded-2xl border p-4 transition sm:p-5 ${overdue ? "border-red-500/30 bg-red-500/[.06]" : item.completed ? "border-emerald-500/25 bg-emerald-500/[.05]" : "border-[var(--border)] bg-[var(--surface)]"}`}><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div className="flex min-w-0 items-start gap-3"><button onClick={() => setDeadlines((current) => current.map((deadline) => deadline.id === item.id ? { ...deadline, completed: !deadline.completed } : deadline))} className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border ${item.completed ? "border-emerald-500 bg-emerald-500 text-white" : "border-[var(--border)] bg-[var(--surface-2)]"}`}>{item.completed && <Check size={15} />}</button><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className={`font-extrabold ${item.completed ? "text-[var(--muted)] line-through" : ""}`}>{item.title}</h3><Badge value={item.priority} /><span className="rounded-full bg-[var(--surface-2)] px-2 py-1 text-[10px] font-bold text-[var(--muted)]">{item.type}</span></div><p className="mt-1 text-xs text-[var(--muted)]">{item.subject || "No subject"}</p><p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)]"><CalendarDays size={13} />{new Date(`${item.date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}{item.time && <> · <Clock3 size={13} />{item.time}</>}</p></div></div><div className="flex items-center justify-between gap-3 sm:justify-end"><span className={`text-sm font-black ${item.completed ? "text-emerald-500" : overdue ? "text-red-500" : "text-violet-500"}`}>{item.completed ? "Completed" : relativeDue(item, now)}</span><button onClick={() => editDeadline(item)} className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--surface-2)] text-[var(--muted)]"><Edit3 size={15} /></button><button onClick={() => window.confirm("Delete this deadline?") && setDeadlines((current) => current.filter((deadline) => deadline.id !== item.id))} className="grid h-9 w-9 place-items-center rounded-xl bg-red-500/10 text-red-500"><Trash2 size={15} /></button></div></div></article>; })}</div>}
                </section>
            </main>

            {toast && <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-red-500/30 bg-[var(--surface)] p-4 shadow-2xl"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-500/15 text-red-500"><Bell size={18} /></span><div className="min-w-0 flex-1"><p className="font-extrabold text-red-500">Deadline exceeded</p><p className="mt-1 truncate text-sm font-semibold">{toast.title}</p><p className="mt-1 text-xs text-[var(--muted)]">This task is now overdue.</p></div><button onClick={() => setToast(null)}><X size={17} /></button></div></div>}
            <style jsx global>{`.field{width:100%;border:1px solid var(--border);border-radius:.75rem;background:var(--surface-2);color:var(--text);padding:.75rem .875rem;font-size:.875rem;outline:none}.field:focus{border-color:#8b5cf6;box-shadow:0 0 0 3px rgba(139,92,246,.12)}.field::placeholder{color:var(--muted)}select.field option{background:var(--surface);color:var(--text)}`}</style>
        </div>
    );
}

function Stat({ label, value, color, icon }: { label: string; value: number; color: string; icon: ReactNode }) { return <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"><div className={`flex items-center gap-2 ${color}`}>{icon}<span className="text-xs font-bold text-[var(--muted)]">{label}</span></div><p className={`mt-3 text-3xl font-black ${color}`}>{value}</p></div>; }
function Field({ label, children }: { label: string; children: ReactNode }) { return <label><span className="mb-1.5 block text-xs font-bold text-[var(--muted)]">{label}</span>{children}</label>; }
function Badge({ value }: { value: Priority }) { const style = value === "High" ? "bg-red-500/15 text-red-500" : value === "Medium" ? "bg-amber-500/15 text-amber-500" : "bg-emerald-500/15 text-emerald-500"; return <span className={`rounded-full px-2 py-1 text-[10px] font-black ${style}`}>{value}</span>; }
