import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { api, NewsItem as ApiNews, EventItem as ApiEvent, AnnouncementItem as ApiAnn, CommentItem as ApiComment, ADMIN_TOKEN_VALUE } from "@/lib/api";



const CATEGORIES = ["Городское хозяйство", "Политика", "Экономика", "Образование", "Социальная сфера", "Культура", "Спорт", "Происшествия"];

type Section = "dashboard" | "news" | "events" | "announcements" | "comments" | "settings";

const NAV_ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: "dashboard", label: "Дашборд", icon: "LayoutDashboard" },
  { id: "news", label: "Новости", icon: "Newspaper" },
  { id: "events", label: "Афиша", icon: "Calendar" },
  { id: "announcements", label: "Объявления", icon: "Tag" },
  { id: "comments", label: "Комментарии", icon: "MessageSquare" },
  { id: "settings", label: "Настройки", icon: "Settings" },
];

/* ─── Auth Gate ─── */
function AuthGate({ onLogin }: { onLogin: (token: string) => void }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setTimeout(() => {
      if (login === "admin" && password === "admin") {
        onLogin(ADMIN_TOKEN_VALUE);
      } else {
        setError(true);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1a2744] border border-[#253561] mb-4">
            <Icon name="Shield" size={26} className="text-[#d4a017]" />
          </div>
          <div className="font-playfair text-2xl font-bold text-white mb-1">Городской вестник</div>
          <div className="font-ptsans text-xs tracking-[0.2em] uppercase text-gray-500">Панель управления</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#161b27] border border-[#1e2a3d] p-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-900/30 border border-red-800/50 text-red-400 font-ptsans text-xs px-3 py-2 mb-4">
              <Icon name="AlertCircle" size={13} />
              Неверный логин или пароль
            </div>
          )}
          <div className="mb-4">
            <label className="block font-ptsans text-[11px] uppercase tracking-widest text-gray-500 mb-1.5">Логин</label>
            <input
              type="text"
              value={login}
              onChange={e => setLogin(e.target.value)}
              placeholder="admin"
              className="w-full bg-[#0f1117] border border-[#1e2a3d] text-white font-ptsans text-sm px-3 py-2.5 focus:outline-none focus:border-[#1a2744]"
            />
          </div>
          <div className="mb-5">
            <label className="block font-ptsans text-[11px] uppercase tracking-widest text-gray-500 mb-1.5">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full bg-[#0f1117] border border-[#1e2a3d] text-white font-ptsans text-sm px-3 py-2.5 focus:outline-none focus:border-[#1a2744]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a2744] hover:bg-[#253561] text-white font-ptsans text-xs font-bold tracking-widest uppercase py-3 transition-colors disabled:opacity-60"
          >
            {loading ? "Вход..." : "Войти в панель"}
          </button>
          <p className="font-ptsans text-[10px] text-gray-600 text-center mt-3">
            Демо: admin / admin
          </p>
        </form>
      </div>
    </div>
  );
}

/* ─── Main CMS ─── */
export default function AdminPanel() {
  const [isAuth, setIsAuth] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [section, setSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  const handleLogin = (token: string) => {
    setIsAuth(true);
    setAdminToken(token);
  };

  if (!isAuth) return <AuthGate onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#0f1117] flex font-ptsans">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-56" : "w-16"} flex-shrink-0 bg-[#161b27] border-r border-[#1e2a3d] flex flex-col transition-all duration-200`}>
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-[#1e2a3d] gap-3">
          <div className="w-7 h-7 bg-[#1a2744] border border-[#253561] flex items-center justify-center flex-shrink-0">
            <Icon name="Newspaper" size={14} className="text-[#d4a017]" />
          </div>
          {sidebarOpen && <span className="font-playfair text-sm font-bold text-white truncate">Вестник CMS</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors relative ${section === item.id ? "bg-[#1a2744] text-white" : "text-gray-400 hover:text-gray-200 hover:bg-[#1a2744]/50"}`}
            >
              {section === item.id && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#d4a017]" />}
              <Icon name={item.icon} size={16} className="flex-shrink-0" />
              {sidebarOpen && (
                <span className="text-xs font-bold tracking-wide uppercase truncate">{item.label}</span>
              )}
              {item.id === "comments" && pendingCount > 0 && sidebarOpen && (
                <span className="ml-auto bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-[#1e2a3d] p-3 flex items-center gap-3">
          <div className="w-7 h-7 bg-[#1a2744] rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="User" size={12} className="text-gray-400" />
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-bold truncate">Администратор</div>
              <div className="text-gray-500 text-[10px] truncate">admin</div>
            </div>
          )}
          {sidebarOpen && (
            <button onClick={() => setIsAuth(false)} className="text-gray-500 hover:text-red-400 transition-colors">
              <Icon name="LogOut" size={14} />
            </button>
          )}
        </div>
      </aside>

      {/* Content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 bg-[#161b27] border-b border-[#1e2a3d] flex items-center px-4 gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-white transition-colors">
            <Icon name="PanelLeft" size={18} />
          </button>
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <span>Городской вестник</span>
            <Icon name="ChevronRight" size={12} />
            <span className="text-white">{NAV_ITEMS.find(n => n.id === section)?.label}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <a href="/" target="_blank" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors">
              <Icon name="ExternalLink" size={13} />
              На сайт
            </a>
            <span className="text-gray-600 text-xs">11.05.2026</span>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-auto p-5">
          {section === "dashboard" && <Dashboard adminToken={adminToken} />}
          {section === "news" && <NewsSection adminToken={adminToken} />}
          {section === "events" && <EventsSection adminToken={adminToken} />}
          {section === "announcements" && <AnnouncementsSection adminToken={adminToken} onPendingChange={setPendingCount} />}
          {section === "comments" && <CommentsSection adminToken={adminToken} onPendingChange={setPendingCount} />}
          {section === "settings" && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}

/* ─── Dashboard ─── */
function Dashboard({ adminToken }: { adminToken: string }) {
  const [statsData, setStatsData] = useState<Record<string, number | Record<string, number>> | null>(null);
  const [recentNews, setRecentNews] = useState<ApiNews[]>([]);
  const [pendingComments, setPendingComments] = useState<ApiComment[]>([]);
  const [pendingAnns, setPendingAnns] = useState<ApiAnn[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!adminToken) return;
    Promise.all([
      api.getStats(adminToken),
      api.getNewsAdmin(adminToken),
      api.getCommentsAdmin(adminToken),
      api.getAnnouncementsAdmin(adminToken),
    ]).then(([stats, news, comments, anns]) => {
      setStatsData(stats);
      setRecentNews(news.slice(0, 4));
      setPendingComments(comments.filter((c: ApiComment) => c.status === "pending"));
      setPendingAnns(anns.filter((a: ApiAnn) => a.status === "pending"));
      setLoadingStats(false);
    }).catch(() => setLoadingStats(false));
  }, [adminToken]);

  const newsStats = (statsData?.news ?? {}) as Record<string, number>;
  const totalPending = (statsData?.pending_comments ?? 0) + (statsData?.pending_announcements ?? 0);

  const stats = [
    { label: "Новостей", value: loadingStats ? "…" : (newsStats.total ?? 0), sub: loadingStats ? "" : `${newsStats.published ?? 0} опубл., ${(newsStats.total ?? 0) - (newsStats.published ?? 0)} черн.`, icon: "Newspaper", color: "text-blue-400" },
    { label: "Просмотров", value: loadingStats ? "…" : Number(newsStats.views ?? 0).toLocaleString("ru"), sub: "за все время", icon: "Eye", color: "text-emerald-400" },
    { label: "На модерации", value: loadingStats ? "…" : totalPending, sub: loadingStats ? "" : `${statsData?.pending_comments ?? 0} комм., ${statsData?.pending_announcements ?? 0} объявл.`, icon: "Clock", color: "text-amber-400" },
    { label: "Событий в афише", value: loadingStats ? "…" : (statsData?.events ?? 0), sub: "ближайшие", icon: "Calendar", color: "text-purple-400" },
  ];

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-playfair text-2xl font-bold text-white mb-0.5">Дашборд</h1>
        <p className="text-gray-500 text-xs">Сводка по порталу</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-[#161b27] border border-[#1e2a3d] p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={s.color}>
                <Icon name={s.icon} size={18} />
              </div>
            </div>
            <div className="font-playfair text-2xl font-bold text-white mb-0.5">{s.value}</div>
            <div className="text-gray-400 text-[11px] font-bold uppercase tracking-wide">{s.label}</div>
            <div className="text-gray-600 text-[10px] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent news */}
        <div className="bg-[#161b27] border border-[#1e2a3d]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2a3d]">
            <span className="text-white text-xs font-bold uppercase tracking-widest">Последние новости</span>
            <Icon name="Newspaper" size={14} className="text-gray-600" />
          </div>
          {recentNews.map(n => (
            <div key={n.id} className="flex items-center gap-3 px-4 py-3 border-b border-[#1e2a3d]/50 last:border-0">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${n.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`} />
              <div className="flex-1 min-w-0">
                <div className="text-gray-200 text-xs truncate">{n.title}</div>
                <div className="text-gray-600 text-[10px]">{new Date(n.created_at).toLocaleDateString("ru-RU")} · {n.author}</div>
              </div>
              <div className="text-gray-600 text-[10px] flex items-center gap-1 flex-shrink-0">
                <Icon name="Eye" size={10} />{n.views}
              </div>
            </div>
          ))}
          {loadingStats && <div className="px-4 py-4 text-center text-gray-600 text-xs">Загрузка...</div>}
        </div>

        {/* Pending moderation */}
        <div className="bg-[#161b27] border border-[#1e2a3d]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2a3d]">
            <span className="text-white text-xs font-bold uppercase tracking-widest">Ожидают модерации</span>
            <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">{totalPending}</span>
          </div>
          {pendingComments.map(c => (
            <div key={c.id} className="px-4 py-3 border-b border-[#1e2a3d]/50">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="MessageSquare" size={11} className="text-gray-500" />
                <span className="text-gray-500 text-[10px]">Комментарий от {c.author}</span>
              </div>
              <div className="text-gray-300 text-xs truncate">{c.body}</div>
            </div>
          ))}
          {pendingAnns.map(a => (
            <div key={a.id} className="px-4 py-3 border-b border-[#1e2a3d]/50">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="Tag" size={11} className="text-gray-500" />
                <span className="text-gray-500 text-[10px]">Объявление · {a.category}</span>
              </div>
              <div className="text-gray-300 text-xs truncate">{a.title}</div>
            </div>
          ))}
          {!loadingStats && totalPending === 0 && (
            <div className="px-4 py-6 text-center text-gray-600 text-xs">Всё проверено ✓</div>
          )}
          {loadingStats && <div className="px-4 py-4 text-center text-gray-600 text-xs">Загрузка...</div>}
        </div>
      </div>
    </div>
  );
}

/* ─── News Section ─── */
function NewsSection({ adminToken }: { adminToken: string }) {
  const [news, setNews] = useState<ApiNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ApiNews | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", category: CATEGORIES[0], summary: "", author: "Редакция", status: "draft" as "draft" | "published" });

  const reload = () => {
    setLoading(true);
    api.getNewsAdmin(adminToken).then(data => { setNews(data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { if (adminToken) reload(); }, [adminToken]);

  const startAdd = () => {
    setForm({ title: "", category: CATEGORIES[0], summary: "", author: "Редакция", status: "draft" });
    setAdding(true);
    setEditing(null);
  };

  const startEdit = (item: ApiNews) => {
    setForm({ title: item.title, category: item.category, summary: item.summary, author: item.author, status: item.status });
    setEditing(item);
    setAdding(false);
  };

  const save = async () => {
    if (!form.title.trim()) return;
    if (adding) {
      await api.createNews(form, adminToken);
    } else if (editing) {
      await api.updateNews(editing.id, form, adminToken);
    }
    setAdding(false);
    setEditing(null);
    reload();
  };

  const remove = async (id: number) => {
    await api.deleteNews(id, adminToken);
    setNews(news.filter(n => n.id !== id));
  };

  const toggleStatus = async (id: number) => {
    const item = news.find(n => n.id === id);
    if (!item) return;
    const newStatus = item.status === "published" ? "draft" : "published";
    await api.updateNews(id, { category: item.category, title: item.title, summary: item.summary, author: item.author, status: newStatus }, adminToken);
    setNews(news.map(n => n.id === id ? { ...n, status: newStatus } : n));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-white mb-0.5">Новости</h1>
          <p className="text-gray-500 text-xs">{loading ? "Загрузка..." : `${news.length} материалов · ${news.filter(n => n.status === "published").length} опубликовано`}</p>
        </div>
        <button onClick={startAdd} className="flex items-center gap-2 bg-[#1a2744] hover:bg-[#253561] text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 transition-colors">
          <Icon name="Plus" size={14} />
          Добавить
        </button>
      </div>

      {(adding || editing) && (
        <div className="bg-[#161b27] border border-[#253561] p-5 mb-5 animate-fade-in">
          <div className="text-white text-xs font-bold uppercase tracking-widest mb-4">
            {adding ? "Новая новость" : "Редактирование"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input
              placeholder="Заголовок новости"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="sm:col-span-2 bg-[#0f1117] border border-[#1e2a3d] text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#253561] placeholder-gray-600"
            />
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="bg-[#0f1117] border border-[#1e2a3d] text-gray-300 text-sm px-3 py-2.5 focus:outline-none"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input
              placeholder="Автор"
              value={form.author}
              onChange={e => setForm({ ...form, author: e.target.value })}
              className="bg-[#0f1117] border border-[#1e2a3d] text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#253561] placeholder-gray-600"
            />
            <textarea
              placeholder="Краткое описание"
              value={form.summary}
              onChange={e => setForm({ ...form, summary: e.target.value })}
              className="sm:col-span-2 bg-[#0f1117] border border-[#1e2a3d] text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#253561] placeholder-gray-600 resize-none h-20"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value as "draft" | "published" })}
              className="bg-[#0f1117] border border-[#1e2a3d] text-gray-300 text-xs px-3 py-2 focus:outline-none"
            >
              <option value="draft">Черновик</option>
              <option value="published">Опубликовать</option>
            </select>
            <button onClick={save} className="bg-[#1a2744] hover:bg-[#253561] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 transition-colors">
              Сохранить
            </button>
            <button onClick={() => { setAdding(false); setEditing(null); }} className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#161b27] border border-[#1e2a3d]">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-0 border-b border-[#1e2a3d] px-4 py-2">
          <span className="text-gray-600 text-[10px] uppercase tracking-widest">Заголовок</span>
          <span className="text-gray-600 text-[10px] uppercase tracking-widest px-4">Статус</span>
          <span className="text-gray-600 text-[10px] uppercase tracking-widest px-4">Просм.</span>
          <span className="text-gray-600 text-[10px] uppercase tracking-widest px-4">Действия</span>
        </div>
        {news.map(n => (
          <div key={n.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-0 border-b border-[#1e2a3d]/40 px-4 py-3 hover:bg-[#1a2744]/20 last:border-0">
            <div>
              <div className="text-gray-200 text-xs mb-0.5 line-clamp-1">{n.title}</div>
              <div className="text-gray-600 text-[10px]">{n.category} · {new Date(n.created_at).toLocaleDateString("ru-RU")} · {n.author}</div>
            </div>
            <div className="px-4">
              <button
                onClick={() => toggleStatus(n.id)}
                className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 ${n.status === "published" ? "bg-emerald-900/50 text-emerald-400 border border-emerald-800" : "bg-amber-900/30 text-amber-500 border border-amber-800/50"}`}
              >
                {n.status === "published" ? "Опубл." : "Черновик"}
              </button>
            </div>
            <div className="px-4 text-gray-500 text-xs flex items-center gap-1">
              <Icon name="Eye" size={11} />{n.views}
            </div>
            <div className="px-4 flex items-center gap-2">
              <button onClick={() => startEdit(n)} className="text-gray-500 hover:text-blue-400 transition-colors">
                <Icon name="Pencil" size={14} />
              </button>
              <button onClick={() => remove(n.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                <Icon name="Trash2" size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Events Section ─── */
function EventsSection({ adminToken }: { adminToken: string }) {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ date: "", title: "", place: "", time: "" });

  const reload = () => {
    setLoading(true);
    api.getEvents().then(data => { setEvents(data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  const startAdd = () => { setForm({ date: "", title: "", place: "", time: "" }); setAdding(true); setEditId(null); };

  const startEdit = (ev: ApiEvent) => {
    setForm({ date: ev.event_date, title: ev.title, place: ev.place, time: ev.event_time });
    setEditId(ev.id);
    setAdding(false);
  };

  const save = async () => {
    if (!form.title.trim()) return;
    if (adding) {
      await api.createEvent({ date: form.date, title: form.title, place: form.place, time: form.time }, adminToken);
    } else if (editId !== null) {
      await api.updateEvent(editId, { date: form.date, title: form.title, place: form.place, time: form.time }, adminToken);
    }
    setAdding(false);
    setEditId(null);
    reload();
  };

  const remove = async (id: number) => {
    await api.deleteEvent(id, adminToken);
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-white mb-0.5">Афиша</h1>
          <p className="text-gray-500 text-xs">{events.length} событий</p>
        </div>
        <button onClick={startAdd} className="flex items-center gap-2 bg-[#1a2744] hover:bg-[#253561] text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 transition-colors">
          <Icon name="Plus" size={14} />
          Добавить
        </button>
      </div>

      {(adding || editId !== null) && (
        <div className="bg-[#161b27] border border-[#253561] p-5 mb-5 animate-fade-in">
          <div className="text-white text-xs font-bold uppercase tracking-widest mb-4">
            {adding ? "Новое событие" : "Редактирование"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input placeholder="Дата (напр. «25 мая»)" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="bg-[#0f1117] border border-[#1e2a3d] text-white text-sm px-3 py-2.5 focus:outline-none placeholder-gray-600" />
            <input placeholder="Время (напр. «18:00»)" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="bg-[#0f1117] border border-[#1e2a3d] text-white text-sm px-3 py-2.5 focus:outline-none placeholder-gray-600" />
            <input placeholder="Название события" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="sm:col-span-2 bg-[#0f1117] border border-[#1e2a3d] text-white text-sm px-3 py-2.5 focus:outline-none placeholder-gray-600" />
            <input placeholder="Место проведения" value={form.place} onChange={e => setForm({ ...form, place: e.target.value })} className="sm:col-span-2 bg-[#0f1117] border border-[#1e2a3d] text-white text-sm px-3 py-2.5 focus:outline-none placeholder-gray-600" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={save} className="bg-[#1a2744] hover:bg-[#253561] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 transition-colors">Сохранить</button>
            <button onClick={() => { setAdding(false); setEditId(null); }} className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Отмена</button>
          </div>
        </div>
      )}

      <div className="bg-[#161b27] border border-[#1e2a3d]">
        {loading && <div className="px-4 py-6 text-center text-gray-600 text-xs">Загрузка...</div>}
        {events.map(ev => (
          <div key={ev.id} className="flex items-center gap-4 px-4 py-3 border-b border-[#1e2a3d]/40 hover:bg-[#1a2744]/20 last:border-0">
            <div className="flex-shrink-0 bg-[#1a2744] text-white text-center w-12 py-1.5">
              <div className="font-playfair text-lg font-bold leading-none">{ev.event_date.split(" ")[0]}</div>
              <div className="text-[9px] uppercase tracking-wide text-gray-400">{ev.event_date.split(" ")[1]}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-gray-200 text-sm truncate">{ev.title}</div>
              <div className="text-gray-600 text-[10px]">{ev.place} · {ev.event_time}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => startEdit(ev)} className="text-gray-500 hover:text-blue-400 transition-colors"><Icon name="Pencil" size={14} /></button>
              <button onClick={() => remove(ev.id)} className="text-gray-500 hover:text-red-400 transition-colors"><Icon name="Trash2" size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Announcements Section ─── */
function AnnouncementsSection({ adminToken, onPendingChange }: { adminToken: string; onPendingChange: (n: number) => void }) {
  const [announcements, setAnnouncements] = useState<ApiAnn[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = () => {
    setLoading(true);
    api.getAnnouncementsAdmin(adminToken).then(data => {
      setAnnouncements(data);
      onPendingChange(data.filter(a => a.status === "pending").length);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { if (adminToken) reload(); }, [adminToken]);

  const approve = async (id: number) => {
    await api.moderateAnnouncement(id, "approved", adminToken);
    const updated = announcements.map(a => a.id === id ? { ...a, status: "approved" as const } : a);
    setAnnouncements(updated);
    onPendingChange(updated.filter(a => a.status === "pending").length);
  };

  const reject = async (id: number) => {
    await api.moderateAnnouncement(id, "rejected", adminToken);
    const updated = announcements.map(a => a.id === id ? { ...a, status: "rejected" as const } : a);
    setAnnouncements(updated);
    onPendingChange(updated.filter(a => a.status === "pending").length);
  };

  const remove = (id: number) => setAnnouncements(announcements.filter(a => a.id !== id));

  const pending = announcements.filter(a => a.status === "pending");
  const rest = announcements.filter(a => a.status !== "pending");

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-playfair text-2xl font-bold text-white mb-0.5">Объявления</h1>
        <p className="text-gray-500 text-xs">{loading ? "Загрузка..." : `${pending.length} на модерации · ${announcements.filter(a => a.status === "approved").length} опубликовано`}</p>
      </div>

      {pending.length > 0 && (
        <div className="mb-5">
          <div className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <Icon name="Clock" size={11} /> На модерации ({pending.length})
          </div>
          <div className="bg-[#161b27] border border-amber-900/50">
            {pending.map(a => (
              <div key={a.id} className="flex items-center gap-4 px-4 py-3 border-b border-[#1e2a3d]/40 last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="text-gray-600 text-[10px] uppercase tracking-wide mb-0.5">{a.category}</div>
                  <div className="text-gray-200 text-sm truncate">{a.title}</div>
                  <div className="text-gray-600 text-[10px]">{a.price} · {new Date(a.created_at).toLocaleDateString("ru-RU")}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => approve(a.id)} className="flex items-center gap-1 bg-emerald-900/40 border border-emerald-800/50 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 hover:bg-emerald-900/60 transition-colors">
                    <Icon name="Check" size={11} /> Одобрить
                  </button>
                  <button onClick={() => reject(a.id)} className="flex items-center gap-1 bg-red-900/30 border border-red-800/50 text-red-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 hover:bg-red-900/50 transition-colors">
                    <Icon name="X" size={11} /> Отклонить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-gray-600 text-[10px] font-bold uppercase tracking-widest mb-2">Все объявления</div>
      <div className="bg-[#161b27] border border-[#1e2a3d]">
        {rest.map(a => (
          <div key={a.id} className="flex items-center gap-4 px-4 py-3 border-b border-[#1e2a3d]/40 last:border-0 hover:bg-[#1a2744]/20">
            <div className="flex-1 min-w-0">
              <div className="text-gray-600 text-[10px] uppercase tracking-wide mb-0.5">{a.category}</div>
              <div className="text-gray-300 text-xs truncate">{a.title}</div>
              <div className="text-gray-600 text-[10px]">{a.price} · {new Date(a.created_at).toLocaleDateString("ru-RU")}</div>
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 border ${a.status === "approved" ? "bg-emerald-900/30 text-emerald-500 border-emerald-800/40" : "bg-red-900/20 text-red-500 border-red-800/30"}`}>
              {a.status === "approved" ? "Одобрено" : "Отклонено"}
            </span>
            <button onClick={() => remove(a.id)} className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"><Icon name="Trash2" size={14} /></button>
          </div>
        ))}
        {rest.length === 0 && <div className="px-4 py-6 text-center text-gray-600 text-xs">Нет обработанных объявлений</div>}
      </div>
    </div>
  );
}

/* ─── Comments Section ─── */
function CommentsSection({ adminToken, onPendingChange }: { adminToken: string; onPendingChange: (n: number) => void }) {
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminToken) return;
    api.getCommentsAdmin(adminToken).then(data => {
      setComments(data);
      onPendingChange(data.filter(c => c.status === "pending").length);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [adminToken]);

  const approve = async (id: number) => {
    await api.moderateComment(id, "approved", adminToken);
    const updated = comments.map(c => c.id === id ? { ...c, status: "approved" as const } : c);
    setComments(updated);
    onPendingChange(updated.filter(c => c.status === "pending").length);
  };

  const reject = async (id: number) => {
    await api.moderateComment(id, "rejected", adminToken);
    const updated = comments.map(c => c.id === id ? { ...c, status: "rejected" as const } : c);
    setComments(updated);
    onPendingChange(updated.filter(c => c.status === "pending").length);
  };

  const remove = (id: number) => setComments(comments.filter(c => c.id !== id));

  const pending = comments.filter(c => c.status === "pending");
  const rest = comments.filter(c => c.status !== "pending");

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-playfair text-2xl font-bold text-white mb-0.5">Комментарии</h1>
        <p className="text-gray-500 text-xs">{loading ? "Загрузка..." : `${pending.length} на модерации · ${comments.filter(c => c.status === "approved").length} опубликовано`}</p>
      </div>

      {pending.length > 0 && (
        <div className="mb-5">
          <div className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <Icon name="Clock" size={11} /> Ожидают проверки ({pending.length})
          </div>
          <div className="bg-[#161b27] border border-amber-900/50 divide-y divide-[#1e2a3d]/40">
            {pending.map(c => (
              <div key={c.id} className="p-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <span className="text-white text-xs font-bold">{c.author}</span>
                    <span className="text-gray-600 text-[10px] ml-2">{new Date(c.created_at).toLocaleDateString("ru-RU")}</span>
                    {c.news_id && <div className="text-gray-600 text-[10px]">К новости #{c.news_id}</div>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => approve(c.id)} className="flex items-center gap-1 bg-emerald-900/40 border border-emerald-800/50 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 hover:bg-emerald-900/60 transition-colors">
                      <Icon name="Check" size={11} /> Одобрить
                    </button>
                    <button onClick={() => reject(c.id)} className="flex items-center gap-1 bg-red-900/30 border border-red-800/50 text-red-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 hover:bg-red-900/50 transition-colors">
                      <Icon name="X" size={11} /> Отклонить
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-gray-600 text-[10px] font-bold uppercase tracking-widest mb-2">Обработанные</div>
      <div className="bg-[#161b27] border border-[#1e2a3d] divide-y divide-[#1e2a3d]/40">
        {rest.map(c => (
          <div key={c.id} className="flex items-start gap-4 p-4 hover:bg-[#1a2744]/20">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-300 text-xs font-bold">{c.author}</span>
                <span className="text-gray-600 text-[10px]">{new Date(c.created_at).toLocaleDateString("ru-RU")}</span>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 border ${c.status === "approved" ? "bg-emerald-900/30 text-emerald-500 border-emerald-800/40" : "bg-red-900/20 text-red-500 border-red-800/30"}`}>
                  {c.status === "approved" ? "Опубл." : "Откл."}
                </span>
              </div>
              <p className="text-gray-400 text-xs">{c.body}</p>
            </div>
            <button onClick={() => remove(c.id)} className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"><Icon name="Trash2" size={14} /></button>
          </div>
        ))}
        {rest.length === 0 && <div className="px-4 py-6 text-center text-gray-600 text-xs">Нет обработанных комментариев</div>}
      </div>
    </div>
  );
}

/* ─── Settings ─── */
function SettingsSection() {
  const [siteName, setSiteName] = useState("Городской вестник");
  const [tagline, setTagline] = useState("Официальный информационный портал города");
  const [email, setEmail] = useState("redakciya@gorodvestnik.ru");
  const [phone, setPhone] = useState("+7 (000) 000-00-00");
  const [address, setAddress] = useState("ул. Советская, 1, каб. 204");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-playfair text-2xl font-bold text-white mb-0.5">Настройки</h1>
        <p className="text-gray-500 text-xs">Основная информация портала</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#161b27] border border-[#1e2a3d] p-5">
          <div className="text-white text-xs font-bold uppercase tracking-widest mb-4 pb-3 border-b border-[#1e2a3d]">Основные данные</div>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-1.5">Название сайта</label>
              <input value={siteName} onChange={e => setSiteName(e.target.value)} className="w-full bg-[#0f1117] border border-[#1e2a3d] text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#253561]" />
            </div>
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-1.5">Подзаголовок</label>
              <input value={tagline} onChange={e => setTagline(e.target.value)} className="w-full bg-[#0f1117] border border-[#1e2a3d] text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#253561]" />
            </div>
          </div>
        </div>

        <div className="bg-[#161b27] border border-[#1e2a3d] p-5">
          <div className="text-white text-xs font-bold uppercase tracking-widest mb-4 pb-3 border-b border-[#1e2a3d]">Контакты</div>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-1.5">E-mail</label>
              <input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#0f1117] border border-[#1e2a3d] text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#253561]" />
            </div>
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-1.5">Телефон</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#0f1117] border border-[#1e2a3d] text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#253561]" />
            </div>
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-1.5">Адрес</label>
              <input value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-[#0f1117] border border-[#1e2a3d] text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#253561]" />
            </div>
          </div>
        </div>

        <div className="bg-[#161b27] border border-[#1e2a3d] p-5">
          <div className="text-white text-xs font-bold uppercase tracking-widest mb-4 pb-3 border-b border-[#1e2a3d]">Модерация</div>
          <div className="space-y-3">
            {[
              { label: "Модерировать комментарии перед публикацией", defaultChecked: true },
              { label: "Модерировать объявления перед публикацией", defaultChecked: true },
              { label: "Уведомления о новых заявках на e-mail", defaultChecked: false },
            ].map(opt => (
              <label key={opt.label} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked={opt.defaultChecked} className="accent-[#d4a017]" />
                <span className="text-gray-300 text-xs">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-[#161b27] border border-[#1e2a3d] p-5">
          <div className="text-white text-xs font-bold uppercase tracking-widest mb-4 pb-3 border-b border-[#1e2a3d]">Безопасность</div>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-1.5">Новый пароль</label>
              <input type="password" placeholder="••••••••" className="w-full bg-[#0f1117] border border-[#1e2a3d] text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#253561] placeholder-gray-700" />
            </div>
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-1.5">Подтверждение пароля</label>
              <input type="password" placeholder="••••••••" className="w-full bg-[#0f1117] border border-[#1e2a3d] text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#253561] placeholder-gray-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button onClick={handleSave} className="bg-[#1a2744] hover:bg-[#253561] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 transition-colors">
          Сохранить настройки
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-emerald-400 text-xs animate-fade-in">
            <Icon name="CheckCircle" size={14} /> Сохранено
          </span>
        )}
      </div>
    </div>
  );
}