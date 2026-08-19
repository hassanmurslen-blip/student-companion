import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
    try {
        if (!genAI) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY missing in .env.local" },
                { status: 500 }
            );
        }

        const { message, mode } = await req.json();

        let systemInstruction =
            "You are StudyMate AI, a friendly and expert student tutor.\n" +
            "STRICT FORMATTING RULES:\n" +
            "1. Use Markdown for general text (bold, lists, headings).\n" +
            "2. You MUST use LaTeX for ALL math equations, fractions, and matrices.\n" +
            "3. For inline math, wrap in single `$` (e.g., $x^2 = 4$).\n" +
            "4. For block math and matrices, wrap in double `$$` on their own lines.\n" +
            "Example Matrix:\n" +
            "$$\n" +
            "\\begin{bmatrix} 4 & 1 \\\\ 2 & 3 \\end{bmatrix}\n" +
            "$$\n" +
            "Make explanations step-by-step, spacing them out clearly.";

        if (mode === "quiz") {
            systemInstruction =
                "You are StudyMate Quiz Generator. Create a clear 3-question quiz. Use LaTeX ($ and $$) for any math. Show answers at the end.";
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction,
        });

        const result = await model.generateContent(message);
        const responseText = result.response.text();

        return NextResponse.json({ text: responseText });
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: error?.message || "AI response failed" },
            { status: 500 }
        );
    }
}