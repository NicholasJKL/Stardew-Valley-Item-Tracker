import { useState } from "react";
import { LayoutGrid, Search, Check, ChevronsUpDown } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { CATEGORIES, type CategoryKey } from "@/lib/categories";
import { cn } from "@/lib/utils";

interface HeaderProps {
  currentCategory: CategoryKey;
  onCategoryChange: (category: CategoryKey) => void;
}

export function Header({ currentCategory, onCategoryChange }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-soil shadow-none">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Логотип */}
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-text-soft">
          <span>🌾</span>
          <span>Stardew Tracker</span>
        </div>

        <div className="flex items-center gap-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="h-11 w-[280px] justify-between rounded-2xl border-border/50 bg-background/50 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-text-soft hover:bg-accent/50 focus:ring-2 focus:ring-emerald-500/20"
              >
                <div className="flex items-center gap-2.5 text-text-main">
                  <LayoutGrid className="h-4 w-4 text-text-main" />
                  {CATEGORIES[currentCategory]?.label}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            
            <PopoverContent 
              className="w-[280px] p-0 rounded-2xl border border-white/10 bg-wood/95 shadow-xl shadow-black/40 backdrop-blur-xl outline-none overflow-hidden"
              align="end"
            >
              <Command className="flex flex-col bg-transparent">
                
                <div className="p-2 border-b border-white/10">
                  <div className="flex items-center rounded-xl border border-white/40 bg-white/5 px-3 transition-colors focus-within:border-white/80 focus-within:bg-white/10">
                    <Search className="mr-2 h-4 w-4 shrink-0 text-white/70" />
                    <CommandPrimitive.Input
                      placeholder="Поиск категории..."
                      className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/50"
                    />
                  </div>
                </div>

                {/* Скроллбар стал чуть толще (w-2.5) и ярче (bg-white/30) */}
                <div 
                  className="max-h-[240px] overflow-y-auto overflow-x-hidden overscroll-contain p-1 
                  [&::-webkit-scrollbar]:w-2.5
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-white/30
                  hover:[&::-webkit-scrollbar-thumb]:bg-white/50"
                >
                  <CommandList className="!max-h-none !overflow-visible p-0">
                    <CommandEmpty className="py-6 text-center text-sm text-white/50">
                      Ничего не найдено.
                    </CommandEmpty>
                    <CommandGroup className="p-0">
                      {Object.entries(CATEGORIES).map(([key, { label }]) => (
                        <CommandItem
                          key={key}
                          value={label}
                          onSelect={() => {
                            onCategoryChange(key as CategoryKey);
                            setOpen(false);
                          }}
                          className="mx-1 my-1 cursor-pointer rounded-lg py-2.5 text-white aria-selected:bg-emerald-500/40 aria-selected:text-white"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              currentCategory === key ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </div>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}