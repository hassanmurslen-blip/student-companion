"use client";

import {
    ArrowLeft, BellRing, Check, Flame, History,
    Moon, MoreHorizontal, Pause, Play, RotateCcw, Settings2, Sparkles,
    Sun, Target, Volume2, VolumeX, X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type Mode = "focus" | "short" | "long";
type Session = { id: number; task: string; minutes: number; completedAt: string };

const defaultDurations: Record<Mode, number> = { focus: 25, short: 5, long: 15 };
const modeInfo: Record<Mode, { label: string; eyebrow: string }> = {
    focus: { label: "Focus", eyebrow: "Deep work session" },
    short: { label: "Short break", eyebrow: "Take a quick breath" },
    long: { label: "Long break", eyebrow: "Recharge properly" },
};

const lightTheme = {
    "--app-bg": "#f7f7ff", "--surface": "#ffffff", "--surface-2": "#f2effb",
    "--text": "#211d35", "--muted": "#77738a", "--border": "#e6e1f1",
    "--shadow": "0 24px 70px rgba(69,48,123,.12)",
} as CSSProperties;

const darkTheme = {
    "--app-bg": "#0c0a14", "--surface": "#17131f", "--surface-2": "#211b2c",
    "--text": "#f5f2ff", "--muted": "#aaa3ba", "--border": "#30283e",
    "--shadow": "0 28px 75px rgba(0,0,0,.36)",
} as CSSProperties;

const STORAGE_KEY = "studentmate-focus-v2";

export default function StudyTimer() {
    const [mode, setMode] = useState<Mode>("focus");
    const [durations, setDurations] = useState(defaultDurations);
    const [secondsLeft, setSecondsLeft] = useState(defaultDurations.focus * 60);
    const [running, setRunning] = useState(false);
    const [task, setTask] = useState("Database assignment");
    const [sessions, setSessions] = useState<Session[]>([]);
    const [sound, setSound] = useState(true);
    const [autoStart, setAutoStart] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [dark, setDark] = useState(false);
    const [ready, setReady] = useState(false);
    const endAt = useRef<number | null>(null);
    const finished = useRef(false);
    const audioContext = useRef<AudioContext | null>(null);

    const totalSeconds = durations[mode] * 60;
    const elapsed = Math.min(1, Math.max(0, 1 - secondsLeft / totalSeconds));
    const formatted = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;
    const todaySessions = useMemo(() => sessions.filter((item) => new Date(item.completedAt).toDateString() === new Date().toDateString()), [sessions]);
    const focusedMinutes = todaySessions.reduce((sum, item) => sum + item.minutes, 0);

    const ring = `conic-gradient(from 0deg, #8b5cf6 0deg, #ec4899 ${elapsed * 360}deg, var(--surface-2) ${elapsed * 360}deg)`;

    const unlockAudio = useCallback(async () => {
        try {
            const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (!audioContext.current || audioContext.current.state === "closed") audioContext.current = new AudioCtx();
            if (audioContext.current.state === "suspended") await audioContext.current.resume();
        } catch {
            return;
        }
    }, []);

    const playBell = useCallback(async (force = false) => {
        if (!sound && !force) return;
        try {
            await unlockAudio();
            const ctx = audioContext.current;
            if (!ctx) return;
            [0, .18, .38].forEach((delay, index) => {
                const oscillator = ctx.createOscillator();
                const gain = ctx.createGain();
                oscillator.type = "sine";
                oscillator.frequency.value = [523, 659, 784][index];
                gain.gain.setValueAtTime(.0001, ctx.currentTime + delay);
                gain.gain.exponentialRampToValueAtTime(.18, ctx.currentTime + delay + .025);
                gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + delay + .25);
                oscillator.connect(gain).connect(ctx.destination);
                oscillator.start(ctx.currentTime + delay);
                oscillator.stop(ctx.currentTime + delay + .27);
            });
        } catch {
            return;
        }
    }, [sound, unlockAudio]);

    useEffect(() => () => {
        if (audioContext.current && audioContext.current.state !== "closed") void audioContext.current.close();
    }, []);

    const completeSession = useCallback(() => {
        void playBell();
        if (mode === "focus") {
            setSessions((current) => [{ id: Date.now(), task: task.trim() || "Focus session", minutes: durations.focus, completedAt: new Date().toISOString() }, ...current].slice(0, 20));
        }
        const nextMode: Mode = mode === "focus" ? "short" : "focus";
        setMode(nextMode);
        setSecondsLeft(durations[nextMode] * 60);
        endAt.current = null;
        if (autoStart) {
            endAt.current = Date.now() + durations[nextMode] * 60_000;
            setRunning(true);
            finished.current = false;
        } else setRunning(false);
    }, [autoStart, durations, mode, playBell, task]);

    useEffect(() => {
        const savedTheme = localStorage.getItem("studentmate-theme");
        setDark(savedTheme ? savedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) try {
            const data = JSON.parse(saved);
            const restoredMode: Mode = data.mode && defaultDurations[data.mode as Mode] ? data.mode : "focus";
            const restoredDurations = { ...defaultDurations, ...data.durations };
            setMode(restoredMode); setDurations(restoredDurations); setTask(data.task ?? "Database assignment");
            setSessions(data.sessions ?? []); setSound(data.sound ?? true); setAutoStart(data.autoStart ?? false);
            if (data.running && data.endAt) {
                const remaining = Math.max(0, Math.ceil((data.endAt - Date.now()) / 1000));
                setSecondsLeft(remaining); endAt.current = data.endAt; setRunning(remaining > 0);
            } else setSecondsLeft(data.secondsLeft ?? restoredDurations[restoredMode] * 60);
        } catch { localStorage.removeItem(STORAGE_KEY); }
        setReady(true);
    }, []);

    useEffect(() => {
        if (!ready) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, durations, secondsLeft, running, endAt: endAt.current, task, sessions, sound, autoStart }));
    }, [mode, durations, secondsLeft, running, task, sessions, sound, autoStart, ready]);

    useEffect(() => {
        if (!running || !endAt.current) return;
        const tick = () => {
            const remaining = Math.max(0, Math.ceil((endAt.current! - Date.now()) / 1000));
            setSecondsLeft(remaining);
            if (remaining === 0 && !finished.current) { finished.current = true; completeSession(); }
        };
        tick();
        const interval = window.setInterval(tick, 250);
        return () => window.clearInterval(interval);
    }, [running, completeSession]);

    useEffect(() => {
        document.title = running ? `${formatted} · ${task || modeInfo[mode].label}` : "Study Timer · StudentMate";
        return () => { document.title = "StudentMate"; };
    }, [formatted, mode, running, task]);

    const selectMode = (next: Mode) => {
        setMode(next); setRunning(false); setSecondsLeft(durations[next] * 60);
        endAt.current = null; finished.current = false;
    };

    const toggle = () => {
        finished.current = false;
        if (running) { setRunning(false); endAt.current = null; return; }
        void unlockAudio();
        const duration = secondsLeft || totalSeconds;
        setSecondsLeft(duration); endAt.current = Date.now() + duration * 1000; setRunning(true);
    };

    const reset = () => { setRunning(false); setSecondsLeft(totalSeconds); endAt.current = null; finished.current = false; };
    const toggleTheme = () => setDark((value) => { localStorage.setItem("studentmate-theme", value ? "light" : "dark"); return !value; });
    const toggleSound = () => {
        if (!sound) void unlockAudio();
        setSound((value) => !value);
    };
    const testSound = () => {
        setSound(true);
        void playBell(true);
    };
    const updateDuration = (key: Mode, value: number) => {
        const safe = Math.min(120, Math.max(1, value || 1));
        setDurations((current) => ({ ...current, [key]: safe }));
        if (key === mode && !running) setSecondsLeft(safe * 60);
    };

    return (
        <div style={dark ? darkTheme : lightTheme} className="min-h-screen bg-[var(--app-bg)] text-[var(--text)] transition-colors duration-300">
            <header className="border-b border-[var(--border)] bg-[var(--app-bg)]/90 px-4 py-4 backdrop-blur-xl sm:px-6">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-lg shadow-purple-500/20"><Sparkles size={18} /></span><span className="hidden sm:block"><strong className="block text-sm">StudentMate</strong><small className="text-[10px] text-[var(--muted)]">Focus studio</small></span></Link>
                    <div className="flex items-center gap-2"><Link href="/" className="flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold"><ArrowLeft size={16} /><span className="hidden sm:inline">Dashboard</span></Link><button onClick={toggleSound} className={`grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] ${sound ? "text-violet-500" : "text-[var(--muted)]"}`} aria-label="Toggle sound">{sound ? <Volume2 size={17} /> : <VolumeX size={17} />}</button><button onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)]" aria-label="Toggle theme">{ready && (dark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-violet-500" />)}</button></div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:py-10">
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-500">Focus studio</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Make this session count.</h1><p className="mt-2 text-sm text-[var(--muted)]">One task. One timer. No distractions.</p></div><button onClick={() => setSettingsOpen(true)} className="flex w-fit items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-bold"><Settings2 size={16} /> Customize timer</button></div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">
                    <section style={{ boxShadow: "var(--shadow)" }} className="relative overflow-hidden rounded-[2.25rem] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8 lg:p-10">
                        <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full bg-violet-500/10 blur-3xl" />
                        <div className="relative mx-auto max-w-2xl">
                            <div className="mx-auto flex w-fit rounded-full bg-[var(--surface-2)] p-1">{(["focus", "short", "long"] as Mode[]).map((item) => <button key={item} onClick={() => selectMode(item)} className={`rounded-full px-4 py-2 text-xs font-extrabold transition sm:px-5 ${mode === item ? "bg-[var(--surface)] text-violet-500 shadow-sm" : "text-[var(--muted)]"}`}>{modeInfo[item].label}</button>)}</div>

                            <label className="mx-auto mt-7 block max-w-md text-center"><span className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[var(--muted)]">I am focusing on</span><input value={task} onChange={(event) => setTask(event.target.value)} className="mt-2 w-full border-0 border-b border-[var(--border)] bg-transparent px-2 py-2 text-center text-lg font-extrabold outline-none transition focus:border-violet-500 sm:text-xl" placeholder="What are you working on?" /></label>

                            <div className="mx-auto mt-7 grid h-[270px] w-[270px] place-items-center rounded-full p-[10px] sm:h-[320px] sm:w-[320px]" style={{ background: ring }}><div className="grid h-full w-full place-items-center rounded-full bg-[var(--surface)] text-center"><div><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-violet-500">{modeInfo[mode].eyebrow}</p><p className="mt-3 text-6xl font-black tabular-nums tracking-[-.06em] sm:text-7xl">{formatted}</p><p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--muted)]">{running ? <><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Session in progress</> : "Ready to begin"}</p></div></div></div>

                            <div className="mt-8 flex items-center justify-center gap-3"><button onClick={reset} className="grid h-12 w-12 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]" aria-label="Reset"><RotateCcw size={17} /></button><button onClick={toggle} className="flex h-14 min-w-40 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 px-8 text-sm font-extrabold text-white shadow-lg shadow-purple-500/25 transition hover:scale-[1.02]">{running ? <Pause size={19} /> : <Play size={19} fill="currentColor" />}{running ? "Pause" : "Start session"}</button><button onClick={() => setSettingsOpen(true)} className="grid h-12 w-12 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]" aria-label="More options"><MoreHorizontal size={19} /></button></div>
                        </div>
                    </section>

                    <aside className="space-y-5">
                        <section className="rounded-[1.75rem] bg-gradient-to-br from-violet-600 to-fuchsia-500 p-5 text-white shadow-xl shadow-purple-500/15"><div className="flex items-start justify-between"><div><p className="text-xs font-bold text-white/65">TODAY'S FOCUS</p><p className="mt-3 text-4xl font-black">{focusedMinutes}<span className="ml-1 text-base text-white/65">min</span></p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15"><Flame size={19} /></span></div><div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4 text-xs"><span className="text-white/65">Completed sessions</span><strong>{todaySessions.length}</strong></div></section>

                        <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5"><div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2"><History size={17} className="text-violet-500" /><h2 className="font-extrabold">Recent focus</h2></div>{sessions.length > 0 && <button onClick={() => setSessions([])} className="text-[10px] font-bold text-[var(--muted)]">Clear</button>}</div>{sessions.length === 0 ? <div className="rounded-2xl bg-[var(--surface-2)] p-5 text-center"><Target size={22} className="mx-auto text-violet-400" /><p className="mt-2 text-xs text-[var(--muted)]">Complete a focus session to build your history.</p></div> : <div className="space-y-2">{sessions.slice(0, 4).map((item) => <div key={item.id} className="flex items-center gap-3 rounded-xl bg-[var(--surface-2)] p-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-500/15 text-emerald-500"><Check size={15} /></span><div className="min-w-0"><p className="truncate text-xs font-bold">{item.task}</p><p className="mt-0.5 text-[10px] text-[var(--muted)]">{item.minutes} min · {new Date(item.completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p></div></div>)}</div>}</section>

                        <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/15 text-blue-500"><BellRing size={18} /></span><div><p className="text-sm font-extrabold">Refresh-safe</p><p className="text-xs text-[var(--muted)]">Timer keeps running accurately</p></div></div></section>
                    </aside>
                </div>
            </main>

            {settingsOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && setSettingsOpen(false)}><section className="w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl"><div className="flex items-center justify-between"><div><h2 className="text-xl font-black">Timer settings</h2><p className="mt-1 text-xs text-[var(--muted)]">Make Pomodoro work your way.</p></div><button onClick={() => setSettingsOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--surface-2)]"><X size={17} /></button></div><div className="mt-6 grid grid-cols-3 gap-3">{(["focus", "short", "long"] as Mode[]).map((item) => <label key={item} className="rounded-xl bg-[var(--surface-2)] p-3"><span className="block text-[10px] font-bold text-[var(--muted)]">{modeInfo[item].label}</span><span className="mt-2 flex items-center gap-1"><input type="number" min="1" max="120" value={durations[item]} onChange={(event) => updateDuration(item, Number(event.target.value))} className="w-full bg-transparent text-xl font-black outline-none" /><small className="text-[10px] text-[var(--muted)]">min</small></span></label>)}</div><button onClick={() => setAutoStart((value) => !value)} className="mt-5 flex w-full items-center justify-between rounded-xl border border-[var(--border)] p-4 text-left"><span><strong className="block text-sm">Auto-start next session</strong><small className="mt-1 block text-[var(--muted)]">Move between focus and breaks automatically.</small></span><span className={`relative h-6 w-11 rounded-full transition ${autoStart ? "bg-violet-500" : "bg-[var(--surface-2)]"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${autoStart ? "left-6" : "left-1"}`} /></span></button><button onClick={testSound} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] py-3 text-sm font-extrabold text-violet-500"><Volume2 size={17} /> Test completion sound</button><button onClick={() => setSettingsOpen(false)} className="mt-3 w-full rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 py-3 text-sm font-extrabold text-white">Save settings</button></section></div>}
        </div>
    );
}
