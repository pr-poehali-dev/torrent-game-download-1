import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";

const GENRES = ["Все", "Экшн", "RPG", "Стратегия", "Инди", "Спорт", "Симулятор", "Хоррор"];

const GAMES = [
  {
    id: 1,
    title: "Elden Ring",
    genre: "RPG",
    year: 2022,
    rating: 9.8,
    description: "Открытый мир, созданный Хидетакой Миядзаки и Джорджем Мартином.",
    tags: ["Соулслайк", "Открытый мир", "Фэнтези"],
    color: "#c8a96e",
  },
  {
    id: 2,
    title: "Cyberpunk 2077",
    genre: "Экшн",
    year: 2020,
    rating: 8.4,
    description: "Открытый мир в мегаполисе будущего. Будьте кем хотите.",
    tags: ["Киберпанк", "RPG", "Открытый мир"],
    color: "#f7e040",
  },
  {
    id: 3,
    title: "Hollow Knight",
    genre: "Инди",
    year: 2017,
    rating: 9.5,
    description: "Атмосферный метроидвания в подземном мире насекомых.",
    tags: ["Метроидвания", "Платформер", "Тёмная тема"],
    color: "#a68dff",
  },
  {
    id: 4,
    title: "Civilization VI",
    genre: "Стратегия",
    year: 2016,
    rating: 8.9,
    description: "Постройте цивилизацию, которая выдержит испытание временем.",
    tags: ["Пошаговая", "4X", "История"],
    color: "#5dbf7f",
  },
  {
    id: 5,
    title: "Resident Evil 4",
    genre: "Хоррор",
    year: 2023,
    rating: 9.3,
    description: "Переосмысление культовой игры в жанре survival-horror.",
    tags: ["Выживание", "Экшн", "Атмосфера"],
    color: "#e05050",
  },
  {
    id: 6,
    title: "Flight Simulator",
    genre: "Симулятор",
    year: 2020,
    rating: 9.1,
    description: "Весь мир в деталях — летайте куда угодно.",
    tags: ["Авиация", "Реализм", "Открытый мир"],
    color: "#40b0f7",
  },
  {
    id: 7,
    title: "FIFA 24",
    genre: "Спорт",
    year: 2023,
    rating: 7.8,
    description: "Лучший футбольный симулятор с реальными игроками.",
    tags: ["Футбол", "Мультиплеер", "Карьера"],
    color: "#00c853",
  },
  {
    id: 8,
    title: "Hades",
    genre: "Инди",
    year: 2020,
    rating: 9.6,
    description: "Рогалик, в котором смерть — это часть истории.",
    tags: ["Рогалик", "Экшн", "Мифология"],
    color: "#ff6b6b",
  },
  {
    id: 9,
    title: "The Witcher 3",
    genre: "RPG",
    year: 2015,
    rating: 9.7,
    description: "Один из лучших RPG всех времён с богатым миром.",
    tags: ["Открытый мир", "Фэнтези", "Нарратив"],
    color: "#d4a843",
  },
];

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

export default function Index() {
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("Все");

  const filtered = useMemo(() => {
    return GAMES.filter((g) => {
      const matchesSearch =
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.genre.toLowerCase().includes(search.toLowerCase()) ||
        g.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesGenre = activeGenre === "Все" || g.genre === activeGenre;
      return matchesSearch && matchesGenre;
    });
  }, [search, activeGenre]);

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
          <button className="text-sm bg-primary text-primary-foreground px-4 py-2 font-display font-medium tracking-wide uppercase hover:bg-primary/80 transition-colors rounded-sm">
            Войти
          </button>
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
            {GAMES.length} игр в каталоге. Поиск по названию, жанру или тегам — мгновенно.
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
        <p className="text-muted-foreground text-sm">
          {filtered.length === 0
            ? "Ничего не найдено"
            : `Найдено: ${filtered.length} ${filtered.length === 1 ? "игра" : filtered.length < 5 ? "игры" : "игр"}`}
        </p>
      </section>

      {/* Games grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {filtered.length === 0 ? (
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

function GameCard({ game, index }: { game: typeof GAMES[0]; index: number }) {
  return (
    <div
      className={`card-hover animate-fade-in bg-card border border-border rounded-sm overflow-hidden cursor-pointer stagger-${Math.min(index + 1, 6)}`}
    >
      {/* Color band */}
      <div
        className="h-1 w-full"
        style={{ background: game.color }}
      />
      
      {/* Placeholder visual */}
      <div
        className="h-48 w-full flex items-center justify-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${game.color}22 0%, ${game.color}08 100%)`,
        }}
      >
        <span
          className="font-display text-8xl font-bold uppercase opacity-10 select-none"
          style={{ color: game.color }}
        >
          {game.title[0]}
        </span>
        <div
          className="absolute top-4 right-4 text-xs font-display font-medium tracking-widest uppercase px-3 py-1 rounded-sm border"
          style={{
            color: game.color,
            borderColor: `${game.color}44`,
            background: `${game.color}11`,
          }}
        >
          {game.genre}
        </div>
      </div>

      {/* Content */}
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
          {game.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">{game.year}</span>
          <button className="flex items-center gap-2 text-sm font-display font-medium tracking-wide uppercase text-primary hover:text-primary/80 transition-colors">
            Подробнее <Icon name="ArrowRight" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
