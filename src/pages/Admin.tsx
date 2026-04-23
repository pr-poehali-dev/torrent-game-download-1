import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/d4957e15-6951-465d-bea2-b26839c9ccf8";

const GENRE_OPTIONS = ["Экшн", "RPG", "Стратегия", "Инди", "Спорт", "Симулятор", "Хоррор"];
const COLOR_OPTIONS = [
  "#c8a96e", "#f7e040", "#a68dff", "#5dbf7f",
  "#e05050", "#40b0f7", "#00c853", "#ff6b6b", "#d4a843",
];

interface Game {
  id: number;
  title: string;
  genre: string;
  year: number;
  rating: number;
  description: string;
  tags: string[];
  color: string;
  created_at: string;
}

const empty = {
  title: "",
  genre: "Инди",
  year: new Date().getFullYear(),
  rating: 8.0,
  description: "",
  tags: "",
  color: "#c8a96e",
  download_url: "",
};

export default function Admin() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      setGames(Array.isArray(parsed) ? parsed : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) { setError("Введите название игры"); return; }
    setSaving(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          year: Number(form.year),
          rating: Number(form.rating),
        }),
      });
      if (res.ok) {
        setForm(empty);
        setSuccess("Игра добавлена!");
        setTimeout(() => setSuccess(""), 3000);
        load();
      } else {
        setError("Ошибка при сохранении");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить игру?")) return;
    setDeleting(id);
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      setGames((prev) => prev.filter((g) => g.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="ArrowLeft" size={16} />
              <span className="text-sm">Каталог</span>
            </a>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-sm flex items-center justify-center">
                <Icon name="Settings" size={14} className="text-primary-foreground" />
              </div>
              <span className="font-display font-bold tracking-widest uppercase text-lg">Админ-панель</span>
            </div>
          </div>
          <span className="text-muted-foreground text-sm">
            {games.length} {games.length === 1 ? "игра" : games.length < 5 ? "игры" : "игр"} в базе
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-sm p-6 sticky top-24">
            <h2 className="font-display font-bold text-lg uppercase tracking-wide mb-6 flex items-center gap-2">
              <Icon name="Plus" size={18} className="text-primary" />
              Добавить игру
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium block mb-1.5">
                  Название *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Elden Ring"
                  className="w-full bg-background border border-border rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium block mb-1.5">
                    Жанр
                  </label>
                  <select
                    value={form.genre}
                    onChange={(e) => setForm({ ...form, genre: e.target.value })}
                    className="w-full bg-background border border-border rounded-sm px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                  >
                    {GENRE_OPTIONS.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium block mb-1.5">
                    Год
                  </label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                    min={1970}
                    max={2030}
                    className="w-full bg-background border border-border rounded-sm px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium block mb-1.5">
                  Рейтинг (0–10)
                </label>
                <input
                  type="number"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  min={0}
                  max={10}
                  step={0.1}
                  className="w-full bg-background border border-border rounded-sm px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium block mb-1.5">
                  Описание
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Короткое описание игры..."
                  className="w-full bg-background border border-border rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium block mb-1.5">
                  Теги (через запятую)
                </label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="Открытый мир, Фэнтези, RPG"
                  className="w-full bg-background border border-border rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium block mb-1.5">
                  Ссылка на скачивание
                </label>
                <input
                  value={form.download_url}
                  onChange={(e) => setForm({ ...form, download_url: e.target.value })}
                  placeholder="https://example.com/game.torrent"
                  className="w-full bg-background border border-border rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium block mb-2">
                  Цвет карточки
                </label>
                <div className="flex gap-2 flex-wrap">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm({ ...form, color: c })}
                      className="w-7 h-7 rounded-sm transition-all"
                      style={{
                        background: c,
                        outline: form.color === c ? `2px solid ${c}` : "none",
                        outlineOffset: "2px",
                        transform: form.color === c ? "scale(1.15)" : "scale(1)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-sm px-3 py-2">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-sm px-3 py-2 flex items-center gap-2">
                  <Icon name="Check" size={14} />
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-primary text-primary-foreground py-3 rounded-sm font-display font-medium tracking-wide uppercase text-sm hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    Сохраняю...
                  </>
                ) : (
                  <>
                    <Icon name="Plus" size={16} />
                    Добавить игру
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Games list */}
        <div className="lg:col-span-3">
          <h2 className="font-display font-bold text-lg uppercase tracking-wide mb-6 flex items-center gap-2">
            <Icon name="List" size={18} className="text-primary" />
            Список игр
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
              <Icon name="Loader2" size={24} className="animate-spin" />
              Загрузка...
            </div>
          ) : games.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground border border-dashed border-border rounded-sm">
              <Icon name="Gamepad2" size={40} />
              <p>Игр пока нет. Добавьте первую!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="bg-card border border-border rounded-sm p-4 flex items-start gap-4 animate-fade-in"
                >
                  <div
                    className="w-1 self-stretch rounded-full shrink-0"
                    style={{ background: game.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display font-bold uppercase tracking-wide text-foreground">
                          {game.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">{game.genre}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">{game.year}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-primary font-bold">★ {game.rating}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(game.id)}
                        disabled={deleting === game.id}
                        className="text-muted-foreground hover:text-red-400 transition-colors shrink-0 disabled:opacity-50"
                      >
                        {deleting === game.id
                          ? <Icon name="Loader2" size={16} className="animate-spin" />
                          : <Icon name="Trash2" size={16} />
                        }
                      </button>
                    </div>
                    {game.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{game.description}</p>
                    )}
                    {game.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {game.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}