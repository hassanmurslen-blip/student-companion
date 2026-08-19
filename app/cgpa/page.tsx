"use client";

import { useState } from "react";
import Link from "next/link";

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

const getGradeFromMarks = (marks: number): GradeResult => {
    if (marks >= 90) return { grade: "A+", points: 4.0 };
    if (marks >= 85) return { grade: "A", points: 4.0 };
    if (marks >= 80) return { grade: "A-", points: 3.7 };
    if (marks >= 75) return { grade: "B+", points: 3.3 };
    if (marks >= 70) return { grade: "B", points: 3.0 };
    if (marks >= 65) return { grade: "B-", points: 2.7 };
    if (marks >= 60) return { grade: "C+", points: 2.3 };
    if (marks >= 55) return { grade: "C", points: 2.0 };
    if (marks >= 50) return { grade: "C-", points: 1.7 };

    return { grade: "F", points: 0.0 };
};

export default function CGPACalculator() {
    const [courses, setCourses] = useState<Course[]>([
        {
            id: 1,
            name: "",
            credits: "",
            marks: "",
        },
    ]);

    const [cgpa, setCgpa] = useState<string | null>(null);
    const [totalCredits, setTotalCredits] = useState(0);

    const addCourse = () => {
        setCourses([
            ...courses,
            {
                id: Date.now(),
                name: "",
                credits: "",
                marks: "",
            },
        ]);
    };

    const removeCourse = (id: number) => {
        setCourses(courses.filter((course) => course.id !== id));
    };

    const updateCourse = (
        id: number,
        field: keyof Course,
        value: string
    ) => {
        setCourses(
            courses.map((course) =>
                course.id === id
                    ? { ...course, [field]: value }
                    : course
            )
        );
    };

    const calculateCGPA = () => {
        let totalQualityPoints = 0;
        let creditsSum = 0;

        courses.forEach((course) => {
            const credits = parseFloat(course.credits);
            const marks = parseFloat(course.marks);

            if (
                !isNaN(credits) &&
                credits > 0 &&
                !isNaN(marks) &&
                marks >= 0 &&
                marks <= 100
            ) {
                const result = getGradeFromMarks(marks);

                totalQualityPoints += credits * result.points;
                creditsSum += credits;
            }
        });

        if (creditsSum === 0) {
            setCgpa(null);
            setTotalCredits(0);
            return;
        }

        const calculatedCGPA =
            totalQualityPoints / creditsSum;

        setCgpa(calculatedCGPA.toFixed(2));
        setTotalCredits(creditsSum);
    };

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

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                        🎓 CGPA Calculator
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Enter your marks and credit hours to calculate your CGPA.
                    </p>

                    <div className="inline-block mt-4 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full">
                        4.0 Grading Scale
                    </div>
                </div>

                {/* Courses */}
                <div className="mt-8 space-y-4">
                    {courses.map((course, index) => {
                        const marks = parseFloat(course.marks);

                        const gradeResult =
                            !isNaN(marks) &&
                                marks >= 0 &&
                                marks <= 100
                                ? getGradeFromMarks(marks)
                                : null;

                        return (
                            <div
                                key={course.id}
                                className="border border-gray-200 rounded-2xl p-5"
                            >
                                {/* Course Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-semibold text-gray-700">
                                        Course {index + 1}
                                    </span>

                                    {courses.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeCourse(course.id)
                                            }
                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                {/* Inputs */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {/* Course Name */}
                                    <input
                                        type="text"
                                        placeholder="Course name"
                                        value={course.name}
                                        onChange={(e) =>
                                            updateCourse(
                                                course.id,
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
                                    />

                                    {/* Credit Hours */}
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        placeholder="Credit hours"
                                        value={course.credits}
                                        onChange={(e) =>
                                            updateCourse(
                                                course.id,
                                                "credits",
                                                e.target.value
                                            )
                                        }
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
                                    />

                                    {/* Marks */}
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        placeholder="Marks / 100"
                                        value={course.marks}
                                        onChange={(e) =>
                                            updateCourse(
                                                course.id,
                                                "marks",
                                                e.target.value
                                            )
                                        }
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
                                    />
                                </div>

                                {/* Automatic Grade */}
                                {gradeResult && (
                                    <div className="mt-3 flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                                        <span className="text-sm text-gray-500">
                                            Grade & GPA
                                        </span>

                                        <span className="font-bold text-indigo-600">
                                            {gradeResult.grade} —{" "}
                                            {gradeResult.points.toFixed(1)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Add Course */}
                <button
                    type="button"
                    onClick={addCourse}
                    className="mt-4 text-indigo-600 font-semibold hover:text-indigo-800"
                >
                    + Add another course
                </button>

                {/* Calculate Button */}
                <button
                    type="button"
                    onClick={calculateCGPA}
                    className="mt-6 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition"
                >
                    Calculate CGPA
                </button>

                {/* Result */}
                {cgpa !== null && (
                    <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-2xl p-6 text-center">
                        <p className="text-gray-600">
                            Your CGPA is
                        </p>

                        <p className="text-5xl font-extrabold text-indigo-600 mt-2">
                            {cgpa}
                        </p>

                        <p className="text-gray-400 text-sm mt-2">
                            out of 4.00
                        </p>

                        <p className="text-sm text-gray-500 mt-3">
                            Total Credit Hours: {totalCredits}
                        </p>
                    </div>
                )}

                {/* Grading Scale */}
                <div className="mt-10 border border-gray-200 rounded-2xl p-5">
                    <h2 className="font-bold text-gray-900">
                        Grading Scale
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-sm">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <strong>90–100</strong>
                            <br />
                            A+ — 4.0
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                            <strong>85–89</strong>
                            <br />
                            A — 4.0
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                            <strong>80–84</strong>
                            <br />
                            A- — 3.7
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                            <strong>75–79</strong>
                            <br />
                            B+ — 3.3
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                            <strong>70–74</strong>
                            <br />
                            B — 3.0
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                            <strong>65–69</strong>
                            <br />
                            B- — 2.7
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                            <strong>60–64</strong>
                            <br />
                            C+ — 2.3
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                            <strong>55–59</strong>
                            <br />
                            C — 2.0
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                            <strong>50–54</strong>
                            <br />
                            C- — 1.7
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                            <strong>Below 50</strong>
                            <br />
                            F — 0.0
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}