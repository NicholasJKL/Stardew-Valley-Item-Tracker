// src/components/CardLayout.tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardLayoutProps {
    children: ReactNode;
    /** Кол-во колонок на разных брейкпоинтах. По умолчанию 2/3/4/5/6. */
    cols?: {
        base?: 1 | 2 | 3 | 4;
        sm?: 2 | 3 | 4 | 5 | 6;
        md?: 3 | 4 | 5 | 6;
        lg?: 4 | 5 | 6 | 7 | 8;
        xl?: 5 | 6 | 7 | 8;
    };
    /** Отступ между карточками (Tailwind-класс). */
    gap?: string;
    className?: string;
}

const COLS_CLASS = {
    base: { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" },
    sm: { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 5: "sm:grid-cols-5", 6: "sm:grid-cols-6" },
    md: { 3: "md:grid-cols-3", 4: "md:grid-cols-4", 5: "md:grid-cols-5", 6: "md:grid-cols-6" },
    lg: { 4: "lg:grid-cols-4", 5: "lg:grid-cols-5", 6: "lg:grid-cols-6", 7: "lg:grid-cols-7", 8: "lg:grid-cols-8" },
    xl: { 5: "xl:grid-cols-5", 6: "xl:grid-cols-6", 7: "xl:grid-cols-7", 8: "xl:grid-cols-8" },
} as const;

export function CardLayout({
    children,
    cols,
    gap = "gap-3",
    className,
}: CardLayoutProps) {
    const c = {
        base: cols?.base ?? 2,
        sm: cols?.sm ?? 3,
        md: cols?.md ?? 4,
        lg: cols?.lg ?? 6,
        xl: cols?.xl ?? 6,
    };

    return (
        <div
            className={cn(
                "grid w-full auto-rows-fr items-stretch",
                gap,
                COLS_CLASS.base[c.base],
                COLS_CLASS.sm[c.sm],
                COLS_CLASS.md[c.md],
                COLS_CLASS.lg[c.lg],
                COLS_CLASS.xl[c.xl],
                className,
            )}
        >
            {children}
        </div>
    );
}