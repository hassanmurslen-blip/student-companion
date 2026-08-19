"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type TimerMode = "focus" | "shortBreak" | "longBreak";

const timerSettings = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

const modeLabels = {
    focus: "Focus",
    shortBreak: "Short Break",
    longBreak: "Long Break",
};

export default function StudyTimer() {
    const [mode, setMode] = useState<TimerMode>("focus");
    const [secondsLeft, setSecondsLeft] = useState(
        timerSettings.focus
    );
    const [isRunning, setIsRunning] = useState(false);
    const [sessions, setSessions] = useState(0);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    setIsRunning(false);

                    if (mode === "focus") {
                        setSessions((prevSessions) => prevSessions + 1);
                    }

                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, mode]);

    const changeMode = (newMode: TimerMode) => {
        setMode(newMode);
        setIsRunning(false);
        setSecondsLeft(timerSettings[newMode]);
    };

    const toggleTimer = () => {
        if (secondsLeft === 0) {
            setSecondsLeft(timerSettings[mode]);
        }

        setIsRunning((prev) => !prev);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setSecondsLeft(timerSettings[mode]);
    };

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    const formattedTime = `${String(minutes).padStart(
        2,
        "0"
    )}:${String(seconds).padStart(2, "0")}`;

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
            <main className="max-w-2xl mx-auto px-6 py-12">
                {/* Heading */}
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                        ⏱️ Study Timer
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Stay focused with the Pomodoro study technique.
                    </p>
                </div>

                {/* Timer Card */}
                <div className="mt-8 border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm">
                    {/* Modes */}
                    <div className="flex justify-center gap-2 flex-wrap">
                        {(
                            Object.keys(timerSettings) as TimerMode[]
                        ).map((timerMode) => (
                            <button
                                key={timerMode}
                                onClick={() => changeMode(timerMode)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${mode === timerMode
                                        ? "bg-indigo-500 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {modeLabels[timerMode]}
                            </button>
                        ))}
                    </div>

                    {/* Timer */}
                    <div className="text-center mt-10">
                        <p className="text-gray-500 font-medium">
                            {modeLabels[mode]}
                        </p>

                        <div className="text-7xl md:text-8xl font-extrabold text-gray-900 tracking-tight mt-3">
                            {formattedTime}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center items-center gap-3 mt-10">
                        <button
                            onClick={toggleTimer}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl transition"
                        >
                            {isRunning ? "Pause" : "Start"}
                        </button>

                        <button
                            onClick={resetTimer}
                            className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl transition"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Sessions */}
                    <div className="mt-10 bg-indigo-50 rounded-2xl p-5 text-center">
                        <p className="text-gray-500 text-sm">
                            Completed Focus Sessions
                        </p>

                        <p className="text-3xl font-bold text-indigo-600 mt-1">
                            {sessions}
                        </p>
                    </div>
                </div>

                {/* How it works */}
                <div className="mt-8 border border-gray-200 rounded-2xl p-6">
                    <h2 className="font-bold text-gray-900 text-lg">
                        How Pomodoro works
                    </h2>

                    <div className="mt-4 space-y-3 text-sm text-gray-600">
                        <p>
                            <strong>1.</strong> Focus on your study for 25 minutes.
                        </p>

                        <p>
                            <strong>2.</strong> Take a 5-minute short break.
                        </p>

                        <p>
                            <strong>3.</strong> After several focus sessions, take
                            a longer 15-minute break.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}