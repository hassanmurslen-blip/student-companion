"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Deadline {
    id: number;
    title: string;
    subject: string;
    type: "Assignment" | "Exam" | "Quiz" | "Project" | "Other";
    date: string;
    time: string;
    priority: "Low" | "Medium" | "High";
    completed: boolean;
}

const STORAGE_KEY = "studymate-deadlines";

const priorityStyles = {
    Low: "bg-green-50 text-green-700",
    Medium: "bg-yellow-50 text-yellow-700",
    High: "bg-red-50 text-red-700",
};

export default function DeadlineTracker() {
    const [deadlines, setDeadlines] = useState<Deadline[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [type, setType] =
        useState<Deadline["type"]>("Assignment");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [priority, setPriority] =
        useState<Deadline["priority"]>("Medium");

    /*
     * LOAD DATA
     * Sirf browser mein component load hone ke baad
     * localStorage se deadlines read hongi.
     */
    useEffect(() => {
        try {
            const savedDeadlines =
                localStorage.getItem(STORAGE_KEY);

            if (savedDeadlines) {
                const parsed = JSON.parse(savedDeadlines);

                if (Array.isArray(parsed)) {
                    setDeadlines(parsed);
                }
            }
        } catch (error) {
            console.error(
                "Error loading deadlines:",
                error
            );
        } finally {
            setIsLoaded(true);
        }
    }, []);

    /*
     * SAVE DATA
     * Data load hone ke baad hi localStorage mein save hoga.
     * Isse initial [] purani data ko overwrite nahi karega.
     */
    useEffect(() => {
        if (!isLoaded) return;

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(deadlines)
            );
        } catch (error) {
            console.error(
                "Error saving deadlines:",
                error
            );
        }
    }, [deadlines, isLoaded]);

    // Add deadline
    const addDeadline = () => {
        if (!title.trim()) {
            alert("Please enter a deadline title.");
            return;
        }

        if (!date) {
            alert("Please select a due date.");
            return;
        }

        const newDeadline: Deadline = {
            id: Date.now(),
            title: title.trim(),
            subject: subject.trim(),
            type,
            date,
            time,
            priority,
            completed: false,
        };

        setDeadlines((previous) => [
            ...previous,
            newDeadline,
        ]);

        // Reset form
        setTitle("");
        setSubject("");
        setType("Assignment");
        setDate("");
        setTime("");
        setPriority("Medium");

        setShowForm(false);
    };

    // Delete deadline
    const deleteDeadline = (id: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this deadline?"
        );

        if (!confirmed) return;

        setDeadlines((previous) =>
            previous.filter(
                (deadline) => deadline.id !== id
            )
        );
    };

    // Mark completed / pending
    const toggleCompleted = (id: number) => {
        setDeadlines((previous) =>
            previous.map((deadline) =>
                deadline.id === id
                    ? {
                        ...deadline,
                        completed: !deadline.completed,
                    }
                    : deadline
            )
        );
    };

    // Calculate days remaining
    const getDaysLeft = (dateString: string) => {
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const dueDate = new Date(dateString);

        dueDate.setHours(0, 0, 0, 0);

        const difference =
            dueDate.getTime() - today.getTime();

        return Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );
    };

    // Format date
    const formatDate = (dateString: string) => {
        const dateObject = new Date(dateString);

        return dateObject.toLocaleDateString(
            "en-US",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };

    // Sort deadlines
    const sortedDeadlines = [...deadlines].sort(
        (a, b) => {
            // Completed deadlines neeche
            if (
                a.completed !== b.completed
            ) {
                return a.completed ? 1 : -1;
            }

            return (
                new Date(a.date).getTime() -
                new Date(b.date).getTime()
            );
        }
    );

    const pendingCount =
        deadlines.filter(
            (deadline) => !deadline.completed
        ).length;

    const completedCount =
        deadlines.filter(
            (deadline) => deadline.completed
        ).length;

    const overdueCount =
        deadlines.filter(
            (deadline) =>
                !deadline.completed &&
                getDaysLeft(deadline.date) < 0
        ).length;

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-gray-200">
                <Link
                    href="/"
                    className="flex items-center gap-2"
                >
                    <div className="bg-indigo-500 w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold">
                        S
                    </div>

                    <span className="text-xl font-bold text-gray-900">
                        StudyMate
                    </span>
                </Link>

                <Link
                    href="/"
                    className="text-indigo-600 font-medium hover:text-indigo-800"
                >
                    ← Back to Home
                </Link>
            </nav>

            {/* Main */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                            📅 Deadline Tracker
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Keep track of assignments, quizzes,
                            exams and projects.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setShowForm((previous) => !previous)
                        }
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-3 rounded-xl transition"
                    >
                        {showForm
                            ? "Cancel"
                            : "+ Add Deadline"}
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 md:gap-5 mt-8">
                    <div className="border border-gray-200 rounded-2xl p-4 md:p-5">
                        <p className="text-sm text-gray-500">
                            Pending
                        </p>

                        <p className="text-2xl md:text-3xl font-bold text-indigo-600 mt-1">
                            {pendingCount}
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-2xl p-4 md:p-5">
                        <p className="text-sm text-gray-500">
                            Completed
                        </p>

                        <p className="text-2xl md:text-3xl font-bold text-green-600 mt-1">
                            {completedCount}
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-2xl p-4 md:p-5">
                        <p className="text-sm text-gray-500">
                            Overdue
                        </p>

                        <p className="text-2xl md:text-3xl font-bold text-red-600 mt-1">
                            {overdueCount}
                        </p>
                    </div>
                </div>

                {/* Add Deadline Form */}
                {showForm && (
                    <div className="mt-8 border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900">
                            Add New Deadline
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Add the details of your upcoming task.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. PF Assignment 2"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-indigo-400"
                                />
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. Programming Fundamentals"
                                    value={subject}
                                    onChange={(e) =>
                                        setSubject(e.target.value)
                                    }
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-indigo-400"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                </label>

                                <select
                                    value={type}
                                    onChange={(e) =>
                                        setType(
                                            e.target.value as Deadline["type"]
                                        )
                                    }
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-indigo-400"
                                >
                                    <option value="Assignment">
                                        Assignment
                                    </option>

                                    <option value="Exam">
                                        Exam
                                    </option>

                                    <option value="Quiz">
                                        Quiz
                                    </option>

                                    <option value="Project">
                                        Project
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>
                                </select>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Priority
                                </label>

                                <select
                                    value={priority}
                                    onChange={(e) =>
                                        setPriority(
                                            e.target.value as Deadline["priority"]
                                        )
                                    }
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-indigo-400"
                                >
                                    <option value="Low">
                                        Low
                                    </option>

                                    <option value="Medium">
                                        Medium
                                    </option>

                                    <option value="High">
                                        High
                                    </option>
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Due Date *
                                </label>

                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) =>
                                        setDate(e.target.value)
                                    }
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-indigo-400"
                                />
                            </div>

                            {/* Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Due Time
                                </label>

                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) =>
                                        setTime(e.target.value)
                                    }
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-indigo-400"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={addDeadline}
                            className="mt-5 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition"
                        >
                            Save Deadline
                        </button>
                    </div>
                )}

                {/* Deadline List */}
                <section className="mt-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">
                            Your Deadlines
                        </h2>

                        {deadlines.length > 0 && (
                            <span className="text-sm text-gray-400">
                                {deadlines.length} total
                            </span>
                        )}
                    </div>

                    {/* Empty State */}
                    {sortedDeadlines.length === 0 ? (
                        <div className="mt-5 border border-dashed border-gray-300 rounded-2xl p-10 text-center">
                            <div className="text-4xl">
                                📅
                            </div>

                            <p className="text-gray-700 font-semibold mt-3">
                                No deadlines yet
                            </p>

                            <p className="text-gray-400 text-sm mt-1">
                                Add your first assignment,
                                quiz or exam.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowForm(true)
                                }
                                className="mt-5 text-indigo-600 font-semibold hover:text-indigo-800"
                            >
                                + Add your first deadline
                            </button>
                        </div>
                    ) : (
                        <div className="mt-5 space-y-4">
                            {sortedDeadlines.map(
                                (deadline) => {
                                    const daysLeft =
                                        getDaysLeft(
                                            deadline.date
                                        );

                                    return (
                                        <div
                                            key={deadline.id}
                                            className={`border rounded-2xl p-5 transition ${deadline.completed
                                                    ? "border-green-200 bg-green-50/30"
                                                    : "border-gray-200 bg-white"
                                                }`}
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3
                                                            className={`text-lg font-bold ${deadline.completed
                                                                    ? "text-gray-400 line-through"
                                                                    : "text-gray-900"
                                                                }`}
                                                        >
                                                            {deadline.title}
                                                        </h3>

                                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                            {deadline.type}
                                                        </span>

                                                        <span
                                                            className={`text-xs px-2 py-1 rounded-full font-medium ${priorityStyles[
                                                                deadline.priority
                                                                ]
                                                                }`}
                                                        >
                                                            {
                                                                deadline.priority
                                                            }
                                                        </span>
                                                    </div>

                                                    {deadline.subject && (
                                                        <p className="text-sm text-gray-500 mt-2">
                                                            {deadline.subject}
                                                        </p>
                                                    )}

                                                    <p className="text-sm text-gray-500 mt-2">
                                                        Due:{" "}
                                                        {formatDate(
                                                            deadline.date
                                                        )}

                                                        {deadline.time &&
                                                            ` • ${deadline.time}`}
                                                    </p>
                                                </div>

                                                {/* Remaining */}
                                                <div className="md:text-right">
                                                    {deadline.completed ? (
                                                        <p className="font-semibold text-green-600">
                                                            ✓ Completed
                                                        </p>
                                                    ) : daysLeft < 0 ? (
                                                        <p className="font-bold text-red-600">
                                                            {Math.abs(
                                                                daysLeft
                                                            )}{" "}
                                                            days overdue
                                                        </p>
                                                    ) : daysLeft === 0 ? (
                                                        <p className="font-bold text-orange-600">
                                                            Due today
                                                        </p>
                                                    ) : daysLeft === 1 ? (
                                                        <p className="font-bold text-orange-600">
                                                            Due tomorrow
                                                        </p>
                                                    ) : (
                                                        <p className="font-bold text-indigo-600">
                                                            {daysLeft} days left
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleCompleted(
                                                            deadline.id
                                                        )
                                                    }
                                                    className={`text-sm font-medium px-4 py-2 rounded-lg ${deadline.completed
                                                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                            : "bg-green-50 text-green-700 hover:bg-green-100"
                                                        }`}
                                                >
                                                    {deadline.completed
                                                        ? "Mark Pending"
                                                        : "✓ Complete"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteDeadline(
                                                            deadline.id
                                                        )
                                                    }
                                                    className="text-sm font-medium px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </section>

                {/* Storage Info */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400">
                        Your deadlines are saved automatically
                        on this device.
                    </p>
                </div>
            </main>
        </div>
    );
}