// src/components/CardItem.tsx
import { Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Item } from "@/types/items";

interface CardItemProps {
    item: Item;
    checked?: boolean;
    onToggle?: (id: string, category: string) => void;
    className?: string;
}

export function CardItem({
    item,
    checked = false,
    onToggle,
    className,
}: CardItemProps) {
    // Формируем URL для вики (пробелы заменяем на _, кодируем спецсимволы)
    const wikiUrl = `https://stardewvalley.fandom.com/ru/wiki/${encodeURIComponent(
        item.name.replace(/\s+/g, "_")
    )}`;

    return (
        <div
            role="button"
            tabIndex={0}
            aria-pressed={checked}
            title={item.name}
            onClick={() => onToggle?.(item.id, item.category)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggle?.(item.id, item.category);
                }
            }}
            className={cn(
                "group relative flex h-auto w-full cursor-pointer flex-col items-stretch justify-start gap-0",
                "whitespace-normal p-2 text-left font-normal outline-none",
                // glass-стили
                "rounded-[2rem] border border-glass-border bg-glass-bg shadow-lg shadow-black/20",
                "text-text-main transition-all duration-200",
                // hover / focus / active
                "hover:-translate-y-0.5 hover:border-glass-highlight hover:bg-glass-highlight hover:text-text-main",
                "focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-0",
                "active:translate-y-0 active:scale-[0.98]",
                // «собрано»
                checked &&
                "border-emerald-400/60 bg-emerald-400/10 hover:bg-emerald-400/15",
                className,
            )}
        >
            {/* Контейнер картинки */}
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl p-1">
                <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    draggable={false}
                    className={cn(
                        "h-32 w-32 object-contain transition-opacity duration-200",
                        "[image-rendering:pixelated]",
                        checked && "opacity-40",
                    )}
                />

                {/* Ссылка на вики (появляется/усиливается при наведении на карточку) */}
                <a
                    href={wikiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // Чтобы клик по ссылке не переключал карточку
                    title="Открыть статью в вики"
                    aria-label={`Открыть статью "${item.name}" в вики`}
                    className={cn(
                        "absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full",
                        "bg-black/40 text-white/70 backdrop-blur-sm transition-all duration-200",
                        "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70",
                        "hover:bg-black/60 hover:text-white hover:scale-110 active:scale-95"
                    )}
                >
                    <ExternalLink className="h-4 w-4" />
                </a>

                {/* Галочка «собрано» */}
                {checked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/40">
                            <Check className="h-6 w-6" strokeWidth={3} />
                        </span>
                    </div>
                )}
            </div>

            {/* Имя + ID */}
            <div className="mt-2 flex flex-col gap-0.5 px-1">
                <span className="line-clamp-2 text-sm font-medium leading-tight text-text-main">
                    {item.name}
                </span>
                <span className="font-mono text-xs text-text-muted">
                    [{item.id}]
                </span>
            </div>
        </div>
    );
}