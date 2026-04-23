import { useState, useMemo, useEffect } from "react";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/d4957e15-6951-465d-bea2-b26839c9ccf8";

const GENRES = ["Все", "Экшн", "RPG", "Стратегия", "Инди", "Спорт", "Симулятор", "Хоррор"];

const ICONS: Record<string, string> = {
  "Все": "Gamepad2",
  "Экшн": "Sword",
  "RPG": "Shield",
  "Стратегия": "Map",
  "Инди": "Sparkles",
  "Спорт": "Trophy",
  "Симулятор": "Plane",
  "Хоррор": "Skull",
};

interface Game {
  id: number;
  title: string;
  genre: string;
  year: number;
  rating: number;
  description: string;
  tags: string[];
  color: string;
  download_url?: string;
}

export default function Index() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("Все");

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((data) => {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        setGames(Array.isArray(parsed) ? parsed : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return games.filter((g) => {
      const matchesSearch =
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.genre.toLowerCase().includes(search.toLowerCase()) ||
        (g.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesGenre = activeGenre === "Все" || g.genre === activeGenre;
      return matchesSearch && matchesGenre;
    });
  }, [search, activeGenre, games]);

  return (
    <div className="min-h-screen bg-background noise-bg">
      {/* Header */}
      <header className="border-b border-border/60 sticky top-0 z-50 backdrop-blur-md bg-background/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <Icon name="Gamepad2" size={16} className="text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold tracking-widest text-foreground uppercase">
              GameVault
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground font-medium">
            <a href="#" className="hover:text-primary transition-colors">Каталог</a>
            <a href="#" className="hover:text-primary transition-colors">Новинки</a>
            <a href="#" className="hover:text-primary transition-colors">Топ-100</a>
          </nav>
          <a
            href="/admin"
            className="text-sm bg-primary text-primary-foreground px-4 py-2 font-display font-medium tracking-wide uppercase hover:bg-primary/80 transition-colors rounded-sm"
          >
            Управление
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-primary"></div>
            <span className="text-primary font-display text-sm tracking-[0.2em] uppercase font-medium">
              Игровой каталог
            </span>
          </div>
          <h1 className="font-display text-6xl md:text-8xl font-bold text-foreground leading-none tracking-tight mb-6 uppercase">
            Найди<br />
            <span className="text-primary">свою</span><br />
            игру
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mb-10 leading-relaxed">
            {loading
              ? "Загружаем каталог..."
              : `${games.length} ${games.length === 1 ? "игра" : games.length < 5 ? "игры" : "игр"} в каталоге. Поиск по названию, жанру или тегам — мгновенно.`}
          </p>
        </div>

        {/* Search */}
        <div className="animate-fade-in stagger-2 relative max-w-2xl">
          <div className="search-glow flex items-center bg-card border border-border rounded-sm overflow-hidden transition-all">
            <div className="pl-5 text-muted-foreground">
              <Icon name="Search" size={18} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию, жанру или тегам..."
              className="flex-1 bg-transparent px-4 py-4 text-foreground placeholder:text-muted-foreground outline-none text-base"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="pr-5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Genres */}
      <section className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex flex-wrap gap-2 animate-fade-in stagger-3">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-display font-medium tracking-wide uppercase transition-all ${
                activeGenre === genre
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              <Icon name={ICONS[genre]} size={14} fallback="Gamepad2" />
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* Results count */}
      <section className="max-w-7xl mx-auto px-6 mb-6">
        {!loading && (
          <p className="text-muted-foreground text-sm">
            {filtered.length === 0
              ? "Ничего не найдено"
              : `Найдено: ${filtered.length} ${filtered.length === 1 ? "игра" : filtered.length < 5 ? "игры" : "игр"}`}
          </p>
        )}
      </section>

      {/* Games grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-32 gap-3 text-muted-foreground">
            <Icon name="Loader2" size={32} className="animate-spin" />
            <span>Загружаем игры...</span>
          </div>
        ) : filtered.length === 0 && games.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 border border-dashed border-border rounded-sm animate-fade-in">
            <Icon name="Gamepad2" size={48} className="text-muted-foreground" />
            <p className="text-muted-foreground text-lg">Каталог пуст</p>
            <a href="/admin" className="text-primary underline underline-offset-4 text-sm">
              Добавить первую игру →
            </a>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 animate-fade-in-fast">
            <Icon name="SearchX" size={48} className="text-muted-foreground" />
            <p className="text-muted-foreground text-lg">По запросу «{search}» ничего не найдено</p>
            <button
              onClick={() => { setSearch(""); setActiveGenre("Все"); }}
              className="text-primary underline underline-offset-4 text-sm"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-sm font-bold tracking-widest text-muted-foreground uppercase">
            GameVault © 2024
          </span>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">О сайте</a>
            <a href="#" className="hover:text-primary transition-colors">Контакты</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function GameCard({ game, index }: { game: Game; index: number }) {
  return (
    <div
      className={`card-hover animate-fade-in bg-card border border-border rounded-sm overflow-hidden cursor-pointer stagger-${Math.min(index + 1, 6)}`}
    >
      <div className="h-1 w-full" style={{ background: game.color }} />

      <div
        className="h-48 w-full flex items-center justify-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${game.color}22 0%, ${game.color}08 100%)` }}
      >
        <span
          className="font-display text-8xl font-bold uppercase opacity-10 select-none"
          style={{ color: game.color }}
        >
          {game.title[0]}
        </span>
        <div
          className="absolute top-4 right-4 text-xs font-display font-medium tracking-widest uppercase px-3 py-1 rounded-sm border"
          style={{ color: game.color, borderColor: `${game.color}44`, background: `${game.color}11` }}
        >
          {game.genre}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display text-xl font-bold text-foreground uppercase tracking-wide leading-tight">
            {game.title}
          </h3>
          <div className="flex items-center gap-1 ml-3 shrink-0">
            <Icon name="Star" size={14} className="text-primary fill-primary" />
            <span className="text-primary font-display font-bold text-sm">{game.rating}</span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{game.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {(game.tags || []).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-sm font-medium">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">{game.year}</span>
          {game.download_url ? (
            <a
              href={game.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-display font-medium tracking-wide uppercase text-primary hover:text-primary/80 transition-colors"
            >
              Скачать <Icon name="Download" size={14} />
            </a>
          ) : (
            <span className="text-xs text-muted-foreground/40 font-display uppercase tracking-wide">
              Ссылка не указана
            </span>
          )}
        </div>
      </div>
    </div>
  );
}