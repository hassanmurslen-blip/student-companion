"use client";

import { BookOpen, Sparkles } from "lucide-react";

export default function StudentCompanionLogo({ compactOnMobile = false, subtitle = "Study smarter, every day" }: { compactOnMobile?: boolean; subtitle?: string }) {
    return (
        <span className="inline-flex items-center gap-3">
            <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[15px] bg-gradient-to-br from-violet-600 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25">
                <span className="absolute -right-3 -top-3 h-7 w-7 rounded-full bg-white/20 blur-sm" />
                <BookOpen size={21} strokeWidth={2.25} className="relative" />
                <Sparkles size={10} strokeWidth={2.5} className="absolute right-1.5 top-1.5 text-yellow-200" />
            </span>
            <span className={compactOnMobile ? "hidden sm:block" : "block"}>
                <strong className="block whitespace-nowrap text-[15px] font-black leading-none tracking-[-.02em]">Student Companion</strong>
                <small className="mt-1.5 block whitespace-nowrap text-[9px] font-bold uppercase tracking-[.12em] text-[var(--muted)]">{subtitle}</small>
            </span>
        </span>
    );
}
