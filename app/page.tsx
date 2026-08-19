
"use client";

import {
  BookOpen,
  Brain,
  Calculator,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Flame,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Plus,
  Settings,
  Sparkles,
  Target,
  Timer,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const upcomingDeadlines = [
  {
    title: "Database Assignment",
    subject: "Database Systems",
    date: "Tomorrow",
    priority: "High",
  },
  {
    title: "Linear Algebra Quiz",
    subject: "Linear Algebra",
    date: "Aug 22",
    priority: "Medium",
  },
  {
    title: "AI Project Proposal",
    subject: "Artificial Intelligence",
    date: "Aug 25",
    priority: "High",
  },
];

const subjects = [
  { name: "Artificial Intelligence", progress: 78 },
  { name: "Database Systems", progress: 64 },
  { name: "Linear Algebra", progress: 52 },
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left - 0 top - 0 z - 50 flex h - screen w - 72 flex - col border - r border - slate - 200 bg - white px - 5 py - 6 transition - transform duration - 300 lg: translate - x - 0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } `}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Sparkles size={20} />
            </div>

            <div>
              <h1 className="font-bold tracking-tight">StudentMate</h1>
              <p className="text-xs text-slate-500">Your academic companion</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1">
          <NavItem icon={<LayoutDashboard size={19} />} label="Dashboard" active />
          <NavItem icon={<Calculator size={19} />} label="CGPA Calculator" />
          <NavItem icon={<Timer size={19} />} label="Study Timer" />
          <NavItem icon={<CalendarDays size={19} />} label="Deadlines" />
          <NavItem icon={<BookOpen size={19} />} label="Flashcards" />
          <NavItem icon={<Brain size={19} />} label="Quiz Maker" />
          <NavItem icon={<MessageCircle size={19} />} label="AI Assistant" />
        </nav>

        <div className="mt-auto">
          <div className="mb-4 rounded-2xl bg-slate-950 p-4 text-white">
            <div className="mb-3 flex items-center gap-2">
              <Zap size={17} />
              <span className="text-sm font-semibold">Study streak</span>
            </div>

            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">7</span>
              <span className="mb-1 text-sm text-slate-400">days</span>
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Keep going. You're doing great.
            </p>
          </div>

          <NavItem icon={<Settings size={19} />} label="Settings" />
        </div>
      </aside>

      {/* Main Area */}
      <section className="lg:ml-72">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#f6f8fc]/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-slate-200 bg-white p-2.5 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="hidden lg:block">
              <p className="text-sm text-slate-500">Wednesday, August 19</p>
              <h2 className="text-lg font-bold">Good afternoon, Hassan</h2>
            </div>

            <div className="flex items-center gap-3">
              <button className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition hover:bg-slate-50 sm:block">
                Search
              </button>

              <button className="relative rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
                <MessageCircle size={19} />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-500" />
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                H
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Mobile Greeting */}
          <div className="mb-6 lg:hidden">
            <p className="text-sm text-slate-500">Wednesday, August 19</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Good afternoon, Hassan
            </h2>
          </div>

          {/* Hero */}
          <section className="mb-6 overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-300">
                  <Sparkles size={14} />
                  Student Companion
                </div>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Stay organized.
                  <br />
                  Study smarter.
                </h1>

                <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400 sm:text-base">
                  Manage your academic life, track deadlines, improve your
                  study habits and get help whenever you need it.
                </p>

                <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                  <Timer size={17} />
                  Start studying
                </button>
              </div>

              <div className="hidden md:block">
                <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <div className="text-center">
                    <p className="text-4xl font-bold">78%</p>
                    <p className="mt-1 text-xs text-slate-400">
                      weekly progress
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              icon={<Trophy size={19} />}
              label="Current CGPA"
              value="3.42"
              helper="/ 4.00"
            />

            <StatCard
              icon={<Clock3 size={19} />}
              label="Study time"
              value="2h 35m"
              helper="today"
            />

            <StatCard
              icon={<Target size={19} />}
              label="Tasks"
              value="5"
              helper="pending"
            />

            <StatCard
              icon={<Flame size={19} />}
              label="Study streak"
              value="7"
              helper="days"
            />
          </section>

          {/* Quick Actions */}
          <section className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Quick actions</h2>
                <p className="text-sm text-slate-500">
                  Get things done faster
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <QuickAction icon={<Calculator />} label="Calculate CGPA" />
              <QuickAction icon={<Timer />} label="Study Timer" />
              <QuickAction icon={<CalendarDays />} label="Add Deadline" />
              <QuickAction icon={<BookOpen />} label="Flashcards" />
              <QuickAction icon={<Brain />} label="Create Quiz" />
              <QuickAction icon={<MessageCircle />} label="Ask AI" />
            </div>
          </section>

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Deadlines */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-bold">Upcoming deadlines</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Don't miss your important work
                  </p>
                </div>

                <button className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                  View all
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="space-y-3">
                {upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.title}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-slate-200 hover:bg-slate-50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        <CalendarDays size={19} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold">
                          {deadline.title}
                        </h3>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {deadline.subject}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold">{deadline.date}</p>
                      <span
                        className={`mt - 1 inline - block rounded - full px - 2 py - 1 text - [10px] font - semibold ${deadline.priority === "High"
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-600"
                          } `}
                      >
                        {deadline.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                <Plus size={17} />
                Add new deadline
              </button>
            </section>

            {/* Study Progress */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="font-bold">Course progress</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your current study progress
                </p>
              </div>

              <div className="space-y-6">
                {subjects.map((subject) => (
                  <div key={subject.name}>
                    <div className="mb-2 flex justify-between gap-3">
                      <span className="truncate text-sm font-medium">
                        {subject.name}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {subject.progress}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-900 transition-all"
                        style={{ width: `${subject.progress}% ` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                <BookOpen size={17} />
                View courses
              </button>
            </section>
          </div>

          {/* Bottom Productivity Section */}
          <section className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-bold">Today's focus</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Keep your momentum going
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 p-2.5">
                  <Target size={19} />
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">Daily goal</span>
                  <span className="font-bold">65%</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[65%] rounded-full bg-slate-900" />
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  1h 57m of your 3-hour daily goal completed.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-bold">AI Student Assistant</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Need help with something?
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 p-2.5">
                  <Sparkles size={19} />
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm leading-6 text-slate-600">
                  Ask me to explain a difficult topic, summarize your notes,
                  create a study plan or prepare quiz questions.
                </p>
              </div>

              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                <MessageCircle size={17} />
                Ask your AI assistant
              </button>
            </div>
          </section>

          <footer className="py-8 text-center text-xs text-slate-400">
            StudentMate · Your academic companion
          </footer>
        </div>
      </section>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around">
          <MobileNavItem icon={<LayoutDashboard />} label="Home" active />
          <MobileNavItem icon={<CalendarDays />} label="Deadlines" />
          <MobileNavItem icon={<Timer />} label="Study" />
          <MobileNavItem icon={<Brain />} label="Quiz" />
          <MobileNavItem icon={<MessageCircle />} label="AI" />
        </div>
      </nav>
    </main>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex w - full items - center gap - 3 rounded - xl px - 3 py - 2.5 text - sm font - medium transition ${active
          ? "bg-slate-950 text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
        } `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function MobileNavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex min - w - 14 flex - col items - center gap - 1 rounded - xl px - 3 py - 1.5 ${active ? "text-slate-950" : "text-slate-400"
        } `}
    >
      <span>{icon}</span>
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  );
}

function StatCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-xl bg-slate-100 p-2.5">{icon}</div>
      </div>

      <p className="text-xs font-medium text-slate-500">{label}</p>

      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-xl font-bold tracking-tight">{value}</span>
        <span className="text-xs text-slate-400">{helper}</span>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="group flex min-h-24 flex-col items-start justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <span className="rounded-xl bg-slate-100 p-2.5 transition group-hover:bg-slate-900 group-hover:text-white">
        {icon}
      </span>

      <span className="text-xs font-semibold leading-4 text-slate-700">
        {label}
      </span>
    </button>
  );
}

