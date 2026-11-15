// src/App.tsx
import { useState, useEffect, useMemo, useRef } from "react";
import { Search, X, Download, Upload } from "lucide-react";
import { Header } from "@/components/Header";
import { CardLayout } from "@/components/CardLayout";
import { CardItem } from "@/components/CardItem";
import { CATEGORIES, type CategoryKey } from "@/lib/categories";
import { toDisplayItems } from "@/lib/items";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Item, RawItem } from "@/types/items";

const getItemKey = (item: Item) => {
  const safeId = item.id || item.name;
  return `${item.name.toLowerCase().trim()}:${safeId}`;
};

function App() {
  const [category, setCategory] = useState<CategoryKey>("objects");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [collected, setCollected] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("stardew-tracker-progress-v3");
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) {
        console.error("Ошибка чтения прогресса", e);
      }
    }
    return new Set();
  });

  useEffect(() => {
    localStorage.setItem("stardew-tracker-progress-v3", JSON.stringify(Array.from(collected)));
  }, [collected]);

  // --- ЭКСПОРТ ---
  const handleExport = () => {
    const dataStr = JSON.stringify(Array.from(collected), null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `stardew-save-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- ИМПОРТ ---
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
          setCollected(new Set(parsed));
          alert("✅ Прогресс успешно загружен!");
        } else {
          alert("❌ Неверный формат файла сохранения.");
        }
      } catch (err) {
        console.error(err);
        alert("❌ Ошибка при чтении файла.");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  const handleCategoryChange = (newCategory: CategoryKey) => {
    setCategory(newCategory);
    setSearchQuery("");
  };

  const handleToggle = (item: Item) => {
    const key = getItemKey(item);

    if (item.category === "golden-hands") {
      const keysToToggle = new Set<string>([key]);

      Object.entries(CATEGORIES).forEach(([cat, catData]) => {
        if (cat === "golden-hands") return;

        const foundItems = (catData.data as RawItem[]).filter((d) => {
          const n = d.names?.['data-ru-RU'] || d.name || d.imageHint;
          return n?.toLowerCase().trim() === item.name.toLowerCase().trim();
        });

        foundItems.forEach((found) => {
          const realId = found.id || found.name || found.imageHint;
          keysToToggle.add(`${item.name.toLowerCase().trim()}:${realId}`);
        });
      });

      const allChecked = Array.from(keysToToggle).every(k => collected.has(k));

      setCollected((prev) => {
        const next = new Set(prev);
        Array.from(keysToToggle).forEach(k => allChecked ? next.delete(k) : next.add(k));
        return next;
      });
    } else {
      setCollected((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
    }
  };

  const displayItems = useMemo(() => {
    const items = toDisplayItems(CATEGORIES[category].data, category);

    if (!searchQuery.trim()) return items;
    const lowerQuery = searchQuery.toLowerCase().trim();
    return items.filter(item => item.name.toLowerCase().includes(lowerQuery));
  }, [category, searchQuery]);

  const currentLabel = CATEGORIES[category].label;
  const totalCount = CATEGORIES[category].data.length;

  const collectedCount = useMemo(() => {
    const items = toDisplayItems(CATEGORIES[category].data, category);
    return items.filter(item => collected.has(getItemKey(item))).length;
  }, [category, collected]);

  return (
    <div className="min-h-screen bg-wood text-text-main">
      <Header currentCategory={category} onCategoryChange={handleCategoryChange} />

      <main className="container mx-auto py-8 px-4">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{currentLabel}</h2>
            <p className="text-text-muted">
              Всего: {totalCount} | Собрано: {collectedCount}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Поле поиска */}
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-main/50" />
              <Input
                type="text"
                placeholder="Поиск предмета..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-xl border-glass-border bg-glass-bg pl-9 pr-9 text-text-main placeholder:text-text-muted backdrop-blur-md transition-colors focus-visible:border-emerald-500/50 focus-visible:ring-1 focus-visible:ring-emerald-500/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-text-muted hover:bg-white/10 hover:text-text-main transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Кнопки сохранения / загрузки */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleExport}
                title="Скачать сохранение"
                // Используем стандартную высоту и отступы shadcn, меняя только цвета под glass
                className="flex-1 sm:flex-none border-glass-border bg-glass-bg hover:bg-glass-highlight hover:text-white transition-colors"
              >
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Экспорт</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                title="Загрузить сохранение"
                className="flex-1 sm:flex-none border-glass-border bg-glass-bg hover:bg-glass-highlight hover:text-white transition-colors"
              >
                <Upload className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Импорт</span>
              </Button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".json,application/json"
                className="hidden"
              />
            </div>
          </div>
        </div>

        {displayItems.length > 0 ? (
          <CardLayout cols={{ base: 2, sm: 3, md: 4, lg: 6, xl: 6 }} gap="gap-4">
            {displayItems.map((item) => {
              const isChecked = collected.has(getItemKey(item));

              return (
                <CardItem
                  key={getItemKey(item)}
                  item={item}
                  checked={isChecked}
                  onToggle={() => handleToggle(item)}
                />
              );
            })}
          </CardLayout>
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[2rem] border border-glass-border bg-glass-bg p-8 text-center backdrop-blur-sm">
            <Search className="mb-4 h-10 w-10 text-text-muted opacity-50" />
            <h3 className="text-lg font-medium text-text-main">Ничего не найдено</h3>
            <p className="mt-1 text-sm text-text-muted">
              По запросу «{searchQuery}» нет предметов в этой категории.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
            >
              Сбросить поиск
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;