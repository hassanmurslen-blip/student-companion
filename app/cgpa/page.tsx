"use client";

import {
    ArrowLeft, BookOpen, Calculator, CheckCircle2, GraduationCap,
    Moon, Plus, RotateCcw, Sparkles, Sun, Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

interface Course {
    id: number;
    name: string;
    credits: string;
    marks: string;
}

interface GradeResult {
    grade: string;
    points: number;
}

const gradingScale = [
    { range: "90–100", grade: "A+", points: 4.0 },
    { range: "85–89", grade: "A", points: 4.0 },
    { range: "80–84", grade: "A−", points: 3.7 },
    { range: "75–79", grade: "B+", points: 3.3 },
    { range: "70–74", grade: "B", points: 3.0 },
    { range: "65–69", grade: "B−", points: 2.7 },
    { range: "60–64", grade: "C+", points: 2.3 },
    { range: "55–59", grade: "C", points: 2.0 },
    { range: "50–54", grade: "C−", points: 1.7 },
    { range: "Below 50", grade: "F", points: 0.0 },
];

const lightTheme = {
    "--app-bg": "#f7f7ff", "--surface": "#ffffff", "--surface-2": "#f3f1ff",
    "--text": "#211d35", "--muted": "#77738a", "--border": "#e8e5f2",
    "--soft-shadow": "0 10px 32px rgba(83,63,140,.08)",
} as CSSProperties;

const darkTheme = {
    "--app-bg": "#0d0b17", "--surface": "#171421", "--surface-2": "#211c30",
    "--text": "#f4f1ff", "--muted": "#aaa4bc", "--border": "#2e2940",
    "--soft-shadow": "0 12px 34px rgba(0,0,0,.25)",
} as CSSProperties;

const blankCourse = (id: number): Course => ({ id, name: "", credits: "", marks: "" });

const getGradeFromMarks = (marks: number): GradeResult => {
    if (marks >= 90) return { grade: "A+", points: 4.0 };
    if (marks >= 85) return { grade: "A", points: 4.0 };
    if (marks >= 80) return { grade: "A−", points: 3.7 };
    if (marks >= 75) return { grade: "B+", points: 3.3 };
    if (marks >= 70) return { grade: "B", points: 3.0 };
    if (marks >= 65) return { grade: "B−", points: 2.7 };
    if (marks >= 60) return { grade: "C+", points: 2.3 };
    if (marks >= 55) return { grade: "C", points: 2.0 };
    if (marks >= 50) return { grade: "C−", points: 1.7 };
    return { grade: "F", points: 0.0 };
};

export default function CGPACalculator() {
    const [courses, setCourses] = useState<Course[]>([blankCourse(1)]);
    const [cgpa, setCgpa] = useState<string | null>(null);
    const [totalCredits, setTotalCredits] = useState(0);
    const [error, setError] = useState("");
    const [dark, setDark] = useState(false);
    const [themeReady, setThemeReady] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("studentmate-theme");
        setDark(saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
        setThemeReady(true);
    }, []);

    const completedCourses = useMemo(
        () => courses.filter((course) => {
            const credits = Number(course.credits);
            const marks = Number(course.marks);
            return course.credits !== "" && course.marks !== "" && credits > 0 && marks >= 0 && marks <= 100;
        }).length,
        [courses],
    );

    const toggleTheme = () => {
        setDark((current) => {
            localStorage.setItem("studentmate-theme", current ? "light" : "dark");
            return !current;
        });
    };

    const updateCourse = (id: number, field: keyof Omit<Course, "id">, value: string) => {
        setCourses((current) => current.map((course) => course.id === id ? { ...course, [field]: value } : course));
        setCgpa(null);
        setError("");
    };

    const addCourse = () => setCourses((current) => [...current, blankCourse(Date.now())]);
    const removeCourse = (id: number) => {
        setCourses((current) => current.filter((course) => course.id !== id));
        setCgpa(null);
        setError("");
    };

    const resetCalculator = () => {
        setCourses([blankCourse(Date.now())]);
        setCgpa(null);
        setTotalCredits(0);
        setError("");
    };

    const calculateCGPA = () => {
        let qualityPoints = 0;
        let creditsSum = 0;
        let invalid = false;

        courses.forEach((course) => {
            if (course.credits === "" && course.marks === "") return;
            const credits = Number(course.credits);
            const marks = Number(course.marks);
            if (!Number.isFinite(credits) || credits <= 0 || !Number.isFinite(marks) || marks < 0 || marks > 100) {
                invalid = true;
                return;
            }
            qualityPoints += credits * getGradeFromMarks(marks).points;
            creditsSum += credits;
        });

        if (invalid) {
            setError("Please enter valid credit hours and marks between 0 and 100.");
            setCgpa(null);
            return;
        }
        if (creditsSum === 0) {
            setError("Add at least one complete course before calculating your CGPA.");
            setCgpa(null);
            return;
        }
        setError("");
        setCgpa((qualityPoints / creditsSum).toFixed(2));
        setTotalCredits(creditsSum);
    };

    return (
        <div style={dark ? darkTheme : lightTheme} className="min-h-screen bg-[var(--app-bg)] text-[var(--text)] transition-colors duration-300">
            <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color:var(--app-bg)]/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20"><Sparkles size={19} /></div>
                        <div className="hidden sm:block"><p className="font-extrabold tracking-tight">StudentMate</p><p className="text-[10px] text-[var(--muted)]">Your academic companion</p></div>
                    </Link>
                    <div className="flex items-center gap-2.5">
                        <Link href="/" className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm font-bold transition hover:-translate-y-0.5"><ArrowLeft size={17} /><span className="hidden sm:inline">Dashboard</span></Link>
                        <button aria-label="Toggle color theme" onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] transition hover:-translate-y-0.5">{themeReady && (dark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-violet-600" />)}</button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
                <section className="relative mb-7 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#6542dc] via-[#7950e8] to-[#dd4e9d] px-6 py-8 text-white shadow-2xl shadow-purple-500/20 sm:px-9">
                    <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur"><GraduationCap size={15} /> Academic toolkit</div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">CGPA Calculator</h1><p className="mt-2 max-w-xl text-sm leading-6 text-white/75">Enter course marks and credit hours to calculate your weighted CGPA accurately on a 4.0 scale.</p></div>
                        <div className="flex gap-3"><HeroStat label="Courses ready" value={`${completedCourses}/${courses.length}`} /><HeroStat label="Scale" value="4.0" /></div>
                    </div>
                </section>

                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <section style={{ boxShadow: "var(--soft-shadow)" }} className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-extrabold">Your courses</h2><p className="mt-1 text-sm text-[var(--muted)]">Grades update automatically as you enter marks.</p></div><button onClick={resetCalculator} className="flex items-center gap-2 rounded-xl bg-[var(--surface-2)] px-3 py-2 text-xs font-bold text-[var(--muted)] hover:text-[var(--text)]"><RotateCcw size={15} /> Reset</button></div>

                        <div className="space-y-4">
                            {courses.map((course, index) => {
                                const marks = Number(course.marks);
                                const grade = course.marks !== "" && marks >= 0 && marks <= 100 ? getGradeFromMarks(marks) : null;
                                return (
                                    <article key={course.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/45 p-4 transition hover:border-violet-400/60 sm:p-5">
                                        <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-500/15 text-xs font-black text-violet-500">{index + 1}</span><span className="text-sm font-bold">Course {index + 1}</span></div>{courses.length > 1 && <button aria-label={`Remove course ${index + 1}`} onClick={() => removeCourse(course.id)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-red-500/15 hover:text-red-500"><Trash2 size={16} /></button>}</div>
                                        <div className="grid gap-3 sm:grid-cols-[1.4fr_.8fr_.8fr]">
                                            <Field label="Course name"><input value={course.name} onChange={(event) => updateCourse(course.id, "name", event.target.value)} placeholder="e.g. Database Systems" className="input-style" /></Field>
                                            <Field label="Credit hours"><input type="number" min="0.5" step="0.5" value={course.credits} onChange={(event) => updateCourse(course.id, "credits", event.target.value)} placeholder="e.g. 3" className="input-style" /></Field>
                                            <Field label="Marks"><input type="number" min="0" max="100" value={course.marks} onChange={(event) => updateCourse(course.id, "marks", event.target.value)} placeholder="0–100" className="input-style" /></Field>
                                        </div>
                                        <div className="mt-3 flex min-h-11 items-center justify-between rounded-xl bg-[var(--surface)] px-4 py-2.5"><span className="text-xs font-semibold text-[var(--muted)]">Automatic grade</span>{grade ? <span className="rounded-lg bg-violet-500/15 px-3 py-1.5 text-sm font-black text-violet-500">{grade.grade} · {grade.points.toFixed(1)} GPA</span> : <span className="text-xs text-[var(--muted)]">Enter marks to preview</span>}</div>
                                    </article>
                                );
                            })}
                        </div>

                        <button onClick={addCourse} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-violet-400/60 py-3 text-sm font-bold text-violet-500 transition hover:bg-violet-500/10"><Plus size={17} /> Add another course</button>
                        {error && <div role="alert" className="mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-500">{error}</div>}
                        <button onClick={calculateCGPA} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5"><Calculator size={18} /> Calculate CGPA</button>
                    </section>

                    <aside className="space-y-6 lg:sticky lg:top-24">
                        <section style={{ boxShadow: "var(--soft-shadow)" }} className="overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)]">
                            <div className="bg-gradient-to-br from-violet-600 to-fuchsia-500 p-6 text-white"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-white/65">Your result</p><p className="mt-1 text-sm text-white/80">Weighted CGPA</p></div><div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15"><GraduationCap size={22} /></div></div><div className="flex items-end gap-2"><span className="text-6xl font-black tracking-tight">{cgpa ?? "—"}</span><span className="mb-2 text-sm font-semibold text-white/65">/ 4.00</span></div></div>
                            <div className="grid grid-cols-2 divide-x divide-[var(--border)] p-5 text-center"><div><p className="text-xs text-[var(--muted)]">Credit hours</p><p className="mt-1 text-xl font-black">{cgpa ? totalCredits : "—"}</p></div><div><p className="text-xs text-[var(--muted)]">Courses</p><p className="mt-1 text-xl font-black">{cgpa ? completedCourses : "—"}</p></div></div>
                            {cgpa && <div className="mx-5 mb-5 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2.5 text-xs font-bold text-emerald-500"><CheckCircle2 size={16} /> Calculation completed successfully</div>}
                        </section>

                        <section style={{ boxShadow: "var(--soft-shadow)" }} className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5"><div className="mb-4 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/15 text-blue-500"><BookOpen size={18} /></div><div><h2 className="font-extrabold">Grading scale</h2><p className="text-xs text-[var(--muted)]">Standard 4.0 scale</p></div></div><div className="grid grid-cols-2 gap-2">{gradingScale.map((item) => <div key={item.range} className="rounded-xl bg-[var(--surface-2)] p-3"><p className="text-[11px] font-semibold text-[var(--muted)]">{item.range}</p><p className="mt-1 text-sm font-black">{item.grade} <span className="font-semibold text-violet-500">· {item.points.toFixed(1)}</span></p></div>)}</div></section>
                    </aside>
                </div>
            </main>

            <style jsx global>{`
        .input-style { width: 100%; border: 1px solid var(--border); border-radius: .75rem; background: var(--surface); color: var(--text); padding: .75rem .875rem; font-size: .875rem; outline: none; transition: border-color .2s, box-shadow .2s; }
        .input-style::placeholder { color: var(--muted); opacity: .7; }
        .input-style:focus { border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139,92,246,.13); }
        input[type="number"]::-webkit-inner-spin-button { opacity: .45; }
      `}</style>
        </div>
    );
}

function HeroStat({ label, value }: { label: string; value: string }) {
    return <div className="min-w-24 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur"><p className="text-[10px] font-bold uppercase tracking-wider text-white/60">{label}</p><p className="mt-1 text-xl font-black">{value}</p></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
    return <label className="block"><span className="mb-1.5 block text-xs font-bold text-[var(--muted)]">{label}</span>{children}</label>;
}
