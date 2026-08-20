"use client";
import Link from "next/link";
import {
  Bell, BookOpen, Brain, Calculator, CalendarDays,
  ChevronRight, Clock3, Flame, LayoutDashboard, Menu, MessageCircle,
  Moon, Plus, Search, Settings, Sparkles, Sun, Target, Timer, Trophy,
  X, Zap,
} from "lucide-react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

const deadlines = [
  { title: "Database Assignment", subject: "Database Systems", date: "Tomorrow", priority: "High" },
  { title: "Linear Algebra Quiz", subject: "Linear Algebra", date: "Aug 22", priority: "Medium" },
  { title: "AI Project Proposal", subject: "Artificial Intelligence", date: "Aug 25", priority: "High" },
];

const subjects = [
  { name: "Artificial Intelligence", progress: 78, color: "#8b5cf6" },
  { name: "Database Systems", progress: 64, color: "#3b82f6" },
  { name: "Linear Algebra", progress: 52, color: "#ec4899" },
];

const lightTheme = {
  "--app-bg": "#f7f7ff", "--surface": "#ffffff", "--surface-2": "#f3f1ff",
  "--text": "#211d35", "--muted": "#77738a", "--border": "#e8e5f2",
  "--shadow": "0 16px 45px rgba(83, 63, 140, .09)", "--soft-shadow": "0 8px 24px rgba(83, 63, 140, .07)",
} as CSSProperties;

const darkTheme = {
  "--app-bg": "#0d0b17", "--surface": "#171421", "--surface-2": "#211c30",
  "--text": "#f4f1ff", "--muted": "#aaa4bc", "--border": "#2e2940",
  "--shadow": "0 18px 55px rgba(0, 0, 0, .32)", "--soft-shadow": "0 10px 28px rgba(0, 0, 0, .24)",
} as CSSProperties;

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("studentmate-theme");
    setDark(saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
    setReady(true);
  }, []);

  const toggleTheme = () => {
    setDark((current) => {
      localStorage.setItem("studentmate-theme", current ? "light" : "dark");
      return !current;
    });
  };

  return (
    <main style={dark ? darkTheme : lightTheme} className="min-h-screen bg-[var(--app-bg)] text-[var(--text)] transition-colors duration-300">
      {sidebarOpen && <button aria-label="Close menu" className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-[var(--border)] bg-[var(--surface)] px-5 py-6 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"><Sparkles size={20} /></div>
            <div><h1 className="font-extrabold tracking-tight">Student Companion</h1><p className="text-xs text-[var(--muted)]">Your academic companion</p></div>
          </div>
          <button aria-label="Close menu" onClick={() => setSidebarOpen(false)} className="rounded-xl p-2 text-[var(--muted)] hover:bg-[var(--surface-2)] lg:hidden"><X size={20} /></button>
        </div>

        <nav className="space-y-1.5">
          <NavItem icon={<LayoutDashboard size={19} />} label="Dashboard" active />
          <NavItem icon={<Calculator size={19} />} label="CGPA Calculator" href="/cgpa" />
          <NavItem icon={<Timer size={19} />} label="Study Timer" href="/timer" />
          <NavItem icon={<CalendarDays size={19} />} label="Deadlines" href="/deadlines" />
          <NavItem icon={<BookOpen size={19} />} label="Flashcards" />
          <NavItem icon={<Brain size={19} />} label="Quiz Maker" />
          <NavItem icon={<MessageCircle size={19} />} label="AI Assistant" href="/assistant" />
        </nav>

        <div className="mt-auto">
          <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-500 p-5 text-white shadow-lg shadow-purple-500/20">
            <div className="mb-4 flex items-center justify-between"><span className="flex items-center gap-2 text-sm font-semibold"><Zap size={17} /> Study streak</span><Flame size={20} /></div>
            <div className="flex items-end gap-2"><span className="text-4xl font-black">7</span><span className="mb-1.5 text-sm text-white/70">days</span></div>
            <p className="mt-2 text-xs text-white/75">You are building a great habit!</p>
          </div>
          <NavItem icon={<Settings size={19} />} label="Settings" />
        </div>
      </aside>

      <section className="pb-20 lg:ml-72 lg:pb-0">
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color:var(--app-bg)]/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <button aria-label="Open menu" onClick={() => setSidebarOpen(true)} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 lg:hidden"><Menu size={20} /></button>
            <div className="hidden lg:block"><p className="text-sm text-[var(--muted)]">Wednesday, August 19</p><h2 className="text-lg font-extrabold">Good afternoon, Hassan 👋</h2></div>
            <div className="flex items-center gap-2.5">
              <button className="hidden items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--muted)] sm:flex"><Search size={17} /> Search</button>
              <button aria-label="Toggle color theme" onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] transition hover:-translate-y-0.5" title={dark ? "Use light theme" : "Use dark theme"}>{ready && (dark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-violet-600" />)}</button>
              <button aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)]"><Bell size={18} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-pink-500 ring-2 ring-[var(--surface)]" /></button>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 text-sm font-bold text-white">H</div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-6 lg:hidden"><p className="text-sm text-[var(--muted)]">Wednesday, August 19</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight">Good afternoon, Hassan 👋</h2></div>

          <section className="relative mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#6d45e5] via-[#7c4ee7] to-[#e24d9a] p-6 text-white shadow-2xl shadow-purple-500/20 sm:p-8">
            <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" /><div className="absolute bottom-[-80px] left-1/3 h-52 w-52 rounded-full bg-blue-400/20 blur-3xl" />
            <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-xl"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur"><Sparkles size={14} /> Student Companion</div><h1 className="text-3xl font-black tracking-tight sm:text-5xl">Make today count.</h1><p className="mt-3 max-w-lg text-sm leading-6 text-white/75 sm:text-base">Organize your classes, reach your goals and turn every study session into visible progress.</p><button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow-lg transition hover:-translate-y-0.5"><Timer size={17} /> Start focus session</button></div>
              <div className="hidden md:grid"><ProgressRing value={78} /></div>
            </div>
          </section>

          <section className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard icon={<Trophy size={19} />} label="Current CGPA" value="3.42" helper="/ 4.00" color="violet" />
            <StatCard icon={<Clock3 size={19} />} label="Study time" value="2h 35m" helper="today" color="blue" />
            <StatCard icon={<Target size={19} />} label="Tasks" value="5" helper="pending" color="pink" />
            <StatCard icon={<Flame size={19} />} label="Study streak" value="7" helper="days" color="amber" />
          </section>

          <SectionHeading title="Quick actions" subtitle="Everything you need, one tap away" />
          <section className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <QuickAction icon={<Calculator />} label="Calculate CGPA" tint="violet" href="/cgpa" /><QuickAction icon={<Timer />} label="Study Timer" tint="blue" href="/timer" /><QuickAction icon={<CalendarDays />} label="Add Deadline" tint="pink" href="/deadlines" /><QuickAction icon={<BookOpen />} label="Flashcards" tint="emerald" /><QuickAction icon={<Brain />} label="Create Quiz" tint="amber" /><QuickAction icon={<MessageCircle />} label="Ask AI" tint="fuchsia" href="/assistant" />
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <div className="mb-5 flex items-center justify-between"><div><h2 className="font-extrabold">Upcoming deadlines</h2><p className="mt-1 text-sm text-[var(--muted)]">Stay ahead of your important work</p></div><button className="flex items-center gap-1 text-sm font-bold text-violet-500">View all <ChevronRight size={16} /></button></div>
              <div className="space-y-3">{deadlines.map((item, index) => <div key={item.title} className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/50 p-4 transition hover:-translate-y-0.5"><div className="flex min-w-0 items-center gap-3"><div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${index === 0 ? "bg-pink-500/15 text-pink-500" : index === 1 ? "bg-amber-500/15 text-amber-500" : "bg-violet-500/15 text-violet-500"}`}><CalendarDays size={19} /></div><div className="min-w-0"><h3 className="truncate text-sm font-bold">{item.title}</h3><p className="mt-1 truncate text-xs text-[var(--muted)]">{item.subject}</p></div></div><div className="shrink-0 text-right"><p className="text-sm font-bold">{item.date}</p><span className={`mt-1 inline-block rounded-full px-2 py-1 text-[10px] font-bold ${item.priority === "High" ? "bg-red-500/15 text-red-500" : "bg-amber-500/15 text-amber-500"}`}>{item.priority}</span></div></div>)}</div>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-violet-400/50 py-3 text-sm font-bold text-violet-500 transition hover:bg-violet-500/10"><Plus size={17} /> Add new deadline</button>
            </Card>

            <Card>
              <div className="mb-6"><h2 className="font-extrabold">Course progress</h2><p className="mt-1 text-sm text-[var(--muted)]">Your learning journey</p></div>
              <div className="space-y-6">{subjects.map((subject) => <div key={subject.name}><div className="mb-2 flex justify-between gap-3"><span className="truncate text-sm font-semibold">{subject.name}</span><span className="text-xs font-bold" style={{ color: subject.color }}>{subject.progress}%</span></div><div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-2)]"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${subject.progress}%`, backgroundColor: subject.color }} /></div></div>)}</div>
              <button className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20"><BookOpen size={17} /> View courses</button>
            </Card>
          </div>

          <section className="mt-6 grid gap-6 md:grid-cols-2">
            <Card><div className="flex items-start justify-between"><div><h2 className="font-extrabold">Today's focus</h2><p className="mt-1 text-sm text-[var(--muted)]">Keep your momentum going</p></div><IconBox tint="violet"><Target size={19} /></IconBox></div><div className="mt-6"><div className="mb-2 flex justify-between text-sm"><span className="font-semibold">Daily goal</span><span className="font-extrabold text-violet-500">65%</span></div><div className="h-3 overflow-hidden rounded-full bg-[var(--surface-2)]"><div className="h-full w-[65%] rounded-full bg-gradient-to-r from-violet-500 to-pink-500" /></div><p className="mt-3 text-xs text-[var(--muted)]">1h 57m of your 3-hour daily goal completed.</p></div></Card>
            <Card><div className="flex items-start justify-between"><div><h2 className="font-extrabold">AI Student Assistant</h2><p className="mt-1 text-sm text-[var(--muted)]">Your personal study partner</p></div><IconBox tint="pink"><Sparkles size={19} /></IconBox></div><div className="mt-5 rounded-2xl bg-[var(--surface-2)] p-4"><p className="text-sm leading-6 text-[var(--muted)]">Explain difficult topics, summarize notes, build study plans or generate a practice quiz in seconds.</p></div><button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 py-3 text-sm font-bold text-white"><MessageCircle size={17} /> Ask your AI assistant</button></Card>
          </section>
          <footer className="py-8 text-center text-xs text-[var(--muted)]">StudentMate · Learn better every day</footer>
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border)] bg-[var(--surface)]/95 px-2 py-2 backdrop-blur-xl lg:hidden"><div className="mx-auto flex max-w-lg items-center justify-around"><MobileNavItem icon={<LayoutDashboard />} label="Home" active /><MobileNavItem icon={<CalendarDays />} label="Deadlines" href="/deadlines" /><MobileNavItem icon={<Timer />} label="Study" href="/timer" /><MobileNavItem icon={<Brain />} label="Quiz" /><MobileNavItem icon={<MessageCircle />} label="AI" href="/assistant" /></div></nav>
    </main>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) { return <section style={{ boxShadow: "var(--soft-shadow)" }} className={`rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5 ${className}`}>{children}</section>; }
function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) { return <div className="mb-3"><h2 className="text-lg font-extrabold">{title}</h2><p className="text-sm text-[var(--muted)]">{subtitle}</p></div>; }
function IconBox({ children, tint }: { children: ReactNode; tint: "violet" | "pink" }) { return <div className={`rounded-xl p-2.5 ${tint === "violet" ? "bg-violet-500/15 text-violet-500" : "bg-pink-500/15 text-pink-500"}`}>{children}</div>; }
function NavItem({ icon, label, href, active = false }: { icon: ReactNode; label: string; href?: string; active?: boolean }) {
  const className = `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active ? "bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-md shadow-purple-500/20" : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"}`;
  const content = <>{icon}<span>{label}</span></>;
  return href ? <Link href={href} className={className}>{content}</Link> : <button type="button" className={className}>{content}</button>;
}
function MobileNavItem({ icon, label, href, active = false }: { icon: ReactNode; label: string; href?: string; active?: boolean }) {
  const className = `flex min-w-14 flex-col items-center gap-1 rounded-xl px-3 py-1.5 ${active ? "text-violet-500" : "text-[var(--muted)]"}`;
  const content = <><span>{icon}</span><span className="text-[10px] font-bold">{label}</span></>;
  return href ? <Link href={href} className={className}>{content}</Link> : <button type="button" className={className}>{content}</button>;
}

const statColors = { violet: "bg-violet-500/15 text-violet-500", blue: "bg-blue-500/15 text-blue-500", pink: "bg-pink-500/15 text-pink-500", amber: "bg-amber-500/15 text-amber-500" };
function StatCard({ icon, label, value, helper, color }: { icon: ReactNode; label: string; value: string; helper: string; color: keyof typeof statColors }) { return <div style={{ boxShadow: "var(--soft-shadow)" }} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:-translate-y-1"><div className={`mb-4 w-fit rounded-xl p-2.5 ${statColors[color]}`}>{icon}</div><p className="text-xs font-semibold text-[var(--muted)]">{label}</p><div className="mt-1 flex items-baseline gap-1"><span className="text-xl font-black tracking-tight">{value}</span><span className="text-xs text-[var(--muted)]">{helper}</span></div></div>; }

const actionColors = { violet: "bg-violet-500/15 text-violet-500", blue: "bg-blue-500/15 text-blue-500", pink: "bg-pink-500/15 text-pink-500", emerald: "bg-emerald-500/15 text-emerald-500", amber: "bg-amber-500/15 text-amber-500", fuchsia: "bg-fuchsia-500/15 text-fuchsia-500" };
function QuickAction({ icon, label, tint, href }: { icon: ReactNode; label: string; tint: keyof typeof actionColors; href?: string }) {
  const className = "group flex min-h-28 flex-col items-start justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left transition hover:-translate-y-1 hover:border-violet-400";
  const content = <><span className={`rounded-xl p-2.5 transition group-hover:scale-110 ${actionColors[tint]}`}>{icon}</span><span className="text-xs font-bold leading-4">{label}</span></>;
  return href ? <Link href={href} style={{ boxShadow: "var(--soft-shadow)" }} className={className}>{content}</Link> : <button type="button" style={{ boxShadow: "var(--soft-shadow)" }} className={className}>{content}</button>;
}
function ProgressRing({ value }: { value: number }) { return <div className="relative grid h-44 w-44 place-items-center rounded-full bg-white/10 p-3 backdrop-blur"><div className="absolute inset-3 rounded-full" style={{ background: `conic-gradient(white ${value * 3.6}deg, rgba(255,255,255,.18) 0)` }} /><div className="relative grid h-32 w-32 place-items-center rounded-full bg-[#7547df] text-center shadow-inner"><div><p className="text-4xl font-black">{value}%</p><p className="mt-1 text-xs text-white/70">weekly progress</p></div></div></div>; }
