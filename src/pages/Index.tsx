import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
}

interface HomePageProps {
  comments: Comment[];
  commentText: string;
  setCommentText: (value: string) => void;
  handleCommentSubmit: (e: React.FormEvent) => void;
  pendingComment: boolean;
}

const HERO_IMAGE = "https://cdn.poehali.dev/projects/e9d4bcbf-30cc-4367-8a8e-725cb46ef9e7/files/37b6c00d-a2ea-4ed8-b632-514b85fb894d.jpg";
const CULTURE_IMAGE = "https://cdn.poehali.dev/projects/e9d4bcbf-30cc-4367-8a8e-725cb46ef9e7/files/0b389c1d-d966-4d63-a360-4564e712f2ff.jpg";

const SECTIONS = ["Главная", "Новости", "Рубрики", "О городе", "Афиша", "Объявления", "Контакты"];

const NEWS = [
  {
    id: 1,
    category: "Городское хозяйство",
    categoryColor: "bg-portal-navy",
    title: "Реконструкция центрального проспекта завершится до конца осени",
    summary: "Городская администрация подтвердила завершение масштабных дорожных работ в срок. На ремонт главной магистрали города выделено более 340 миллионов рублей.",
    date: "11 мая 2026",
    author: "Редакция",
    featured: true,
    image: HERO_IMAGE,
  },
  {
    id: 2,
    category: "Политика",
    categoryColor: "bg-portal-red",
    title: "Городская дума рассмотрит поправки к бюджету на следующей неделе",
    summary: "Депутаты обсудят перераспределение средств в пользу социальных программ и капитального ремонта жилого фонда.",
    date: "11 мая 2026",
    author: "А. Смирнов",
    featured: false,
    image: null,
  },
  {
    id: 3,
    category: "Экономика",
    categoryColor: "bg-portal-navy",
    title: "В городе откроется новый промышленный технопарк",
    summary: "Инвестиции в проект составят свыше 1,2 миллиарда рублей. Ожидается создание более 800 рабочих мест для квалифицированных специалистов.",
    date: "10 мая 2026",
    author: "Е. Волков",
    featured: false,
    image: null,
  },
  {
    id: 4,
    category: "Образование",
    categoryColor: "bg-portal-gold",
    title: "Три городские школы вошли в топ-100 лучших учебных заведений России",
    summary: "По итогам национального рейтинга образовательных организаций местные школы заняли высокие позиции в категории естественных наук.",
    date: "10 мая 2026",
    author: "О. Петрова",
    featured: false,
    image: null,
  },
  {
    id: 5,
    category: "Социальная сфера",
    categoryColor: "bg-portal-navy",
    title: "Открыт новый корпус городской больницы после капитального ремонта",
    summary: "В торжественном открытии принял участие глава городской администрации. В обновлённом корпусе установлено современное диагностическое оборудование.",
    date: "9 мая 2026",
    author: "Редакция",
    featured: false,
    image: null,
  },
];

const EVENTS = [
  { date: "13 мая", title: "Концерт городского симфонического оркестра", place: "Дом культуры", time: "19:00" },
  { date: "15 мая", title: "Выставка «Наш город вчера и сегодня»", place: "Краеведческий музей", time: "10:00" },
  { date: "17 мая", title: "Международный день музеев — вход свободный", place: "Все музеи города", time: "Весь день" },
  { date: "19 мая", title: "Литературные чтения в городском парке", place: "Парк Победы", time: "15:00" },
  { date: "22 мая", title: "День защиты детей: праздничная программа", place: "Площадь Ленина", time: "12:00" },
];

const ANNOUNCEMENTS = [
  { id: 1, category: "Недвижимость", title: "Продаётся 3-комнатная квартира, ул. Советская, 14", price: "4 200 000 ₽", date: "11.05.2026" },
  { id: 2, category: "Работа", title: "Требуется инженер-конструктор в проектное бюро", price: "от 65 000 ₽", date: "11.05.2026" },
  { id: 3, category: "Услуги", title: "Юридические консультации: жилищное право", price: "от 1 500 ₽", date: "10.05.2026" },
  { id: 4, category: "Продажа", title: "Мебельный гарнитур в хорошем состоянии", price: "35 000 ₽", date: "10.05.2026" },
];

const RUBRICS = [
  { name: "Городское хозяйство", count: 128, icon: "Building2" },
  { name: "Политика и власть", count: 94, icon: "Landmark" },
  { name: "Экономика", count: 73, icon: "TrendingUp" },
  { name: "Образование", count: 61, icon: "GraduationCap" },
  { name: "Здравоохранение", count: 57, icon: "Heart" },
  { name: "Культура", count: 102, icon: "Music" },
  { name: "Спорт", count: 48, icon: "Trophy" },
  { name: "Происшествия", count: 39, icon: "AlertTriangle" },
];

const TICKER_ITEMS = [
  "Температура воздуха сегодня: +14°C, переменная облачность",
  "Городская дума: очередное заседание 14 мая в 10:00",
  "Внимание! Плановое отключение воды в Центральном районе 13 мая с 9:00 до 17:00",
  "Набор в молодёжный городской совет продолжается до 20 мая",
  "Коммунальная служба информирует: ямочный ремонт дорог завершён в 12 районах",
];

const ABOUT_CITY = {
  population: "342 800",
  founded: "1748",
  area: "524 км²",
  districts: "9",
};

export default function Index() {
  const [activeSection, setActiveSection] = useState("Главная");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments] = useState([
    { id: 1, author: "Сергей В.", text: "Давно ждали этого решения по дороге. Надеемся, сделают качественно.", date: "11.05.2026" },
    { id: 2, author: "Марина К.", text: "Хорошая новость про школы. Гордимся нашими учителями!", date: "10.05.2026" },
  ]);
  const [pendingComment, setPendingComment] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setPendingComment(true);
    setCommentText("");
  };

  const today = new Date().toLocaleDateString("ru-RU", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  const renderContent = () => {
    switch (activeSection) {
      case "Новости": return <NewsPage />;
      case "Рубрики": return <RubricsPage />;
      case "О городе": return <AboutCityPage />;
      case "Афиша": return <AfishaPage />;
      case "Объявления": return <AnnouncementsPage />;
      case "Контакты": return <ContactsPage />;
      default: return (
        <HomePage
          comments={comments}
          commentText={commentText}
          setCommentText={setCommentText}
          handleCommentSubmit={handleCommentSubmit}
          pendingComment={pendingComment}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-portal-paper">
      {/* Top bar */}
      <div className="bg-portal-navy-dark text-white py-1.5 px-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[11px] font-ptsans text-gray-300">
            <span className="capitalize">{today}</span>
            <span className="hidden sm:flex items-center gap-1 text-gray-400">
              <Icon name="Thermometer" size={12} />
              +14°C
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-ptsans text-gray-300">
            <span className="hidden md:flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
              <Icon name="User" size={12} /> Войти
            </span>
            <span className="hidden md:flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
              <Icon name="Bell" size={12} /> Подписки
            </span>
            <span className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
              <Icon name="Rss" size={12} /> RSS
            </span>
          </div>
        </div>
      </div>

      {/* Breaking news ticker */}
      <div className="bg-portal-red text-white py-1.5 overflow-hidden">
        <div className="flex items-center">
          <span className="flex-shrink-0 font-ptsans text-[10px] font-bold tracking-widest uppercase bg-white text-portal-red px-3 py-0.5 mr-3">
            СРОЧНО
          </span>
          <div className="ticker-wrap flex-1">
            <div className="ticker-content font-ptsans text-xs">
              {TICKER_ITEMS.join("  ·  ")}
            </div>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="bg-white border-b-2 border-portal-navy py-4 px-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="font-playfair font-black text-portal-navy text-3xl sm:text-4xl tracking-tight leading-none">
              Городской вестник
            </div>
            <div className="font-ptsans text-[11px] tracking-[0.15em] uppercase text-portal-gray mt-1">
              Официальный информационный портал города
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск по порталу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="font-ptsans text-sm border border-portal-gray-light bg-portal-paper px-3 py-2 pr-8 w-56 focus:outline-none focus:border-portal-navy"
              />
              <Icon name="Search" size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-portal-gray" />
            </div>
          </div>
          <button
            className="md:hidden text-portal-navy"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-portal-navy sticky top-0 z-40 shadow-md">
        <div className="max-w-[1200px] mx-auto">
          <div className={`${mobileMenuOpen ? "flex flex-col" : "hidden"} md:flex md:flex-row`}>
            {SECTIONS.map((section) => (
              <button
                key={section}
                onClick={() => { setActiveSection(section); setMobileMenuOpen(false); }}
                className={`nav-link text-left ${activeSection === section ? "bg-portal-navy-light text-portal-gold-light" : ""}`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-[1200px] mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-portal-navy-dark text-gray-300 mt-8">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
            <div>
              <div className="font-playfair text-white text-xl font-bold mb-3">Городской вестник</div>
              <p className="font-ptsans text-xs text-gray-400 leading-relaxed">
                Официальный информационный портал. Свидетельство о регистрации СМИ: ЭЛ № ФС77-XXXXX.
              </p>
            </div>
            <div>
              <div className="font-ptsans text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">Разделы</div>
              {SECTIONS.map(s => (
                <button key={s} onClick={() => setActiveSection(s)} className="block font-ptsans text-xs text-gray-400 hover:text-white mb-1.5 transition-colors">{s}</button>
              ))}
            </div>
            <div>
              <div className="font-ptsans text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">Информация</div>
              {["Редакционная политика", "Реклама на портале", "Условия использования", "Политика конфиденциальности", "Архив номеров"].map(item => (
                <div key={item} className="font-ptsans text-xs text-gray-400 hover:text-white mb-1.5 cursor-pointer transition-colors">{item}</div>
              ))}
            </div>
            <div>
              <div className="font-ptsans text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">Контакты</div>
              <div className="space-y-2">
                <div className="flex items-start gap-2 font-ptsans text-xs text-gray-400">
                  <Icon name="MapPin" size={12} className="mt-0.5 flex-shrink-0 text-portal-gold" />
                  ул. Советская, 1, каб. 204
                </div>
                <div className="flex items-center gap-2 font-ptsans text-xs text-gray-400">
                  <Icon name="Phone" size={12} className="flex-shrink-0 text-portal-gold" />
                  +7 (000) 000-00-00
                </div>
                <div className="flex items-center gap-2 font-ptsans text-xs text-gray-400">
                  <Icon name="Mail" size={12} className="flex-shrink-0 text-portal-gold" />
                  redakciya@gorodvestnik.ru
                </div>
              </div>
            </div>
          </div>
          <div className="single-rule mb-4" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-ptsans text-[11px] text-gray-500">© 2026 Городской вестник. Все права защищены.</span>
            <span className="font-ptsans text-[11px] text-gray-500">При использовании материалов ссылка на источник обязательна.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomePage({ comments, commentText, setCommentText, handleCommentSubmit, pendingComment }: HomePageProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
      <div>
        <div className="mb-6 animate-fade-in stagger-1">
          <div className="double-rule mb-1" />
          <div className="portal-section-title mt-3">Главные новости</div>

          <div className="border border-portal-gray-light bg-white mb-4 overflow-hidden">
            <div className="relative">
              <img src={HERO_IMAGE} alt="Главная новость" className="w-full h-64 object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                <span className="tag-badge-red mb-2 inline-block">Эксклюзив</span>
                <h1 className="news-headline text-white text-2xl sm:text-3xl leading-tight">
                  Реконструкция центрального проспекта завершится до конца осени
                </h1>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-3">
                <span className="tag-badge">Городское хозяйство</span>
                <span className="news-meta">11 мая 2026 · Редакция</span>
              </div>
              <p className="font-ptserif text-sm text-portal-ink-light leading-relaxed mb-4">
                Городская администрация подтвердила завершение масштабных дорожных работ в срок. На ремонт главной магистрали города выделено более 340 миллионов рублей из средств регионального бюджета. По словам мэра, работы ведутся строго по графику, несмотря на неблагоприятные погодные условия.
              </p>
              <button className="btn-primary">Читать полностью</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {NEWS.slice(1, 5).map((item, i) => (
              <article key={item.id} className={`bg-white border border-portal-gray-light p-4 animate-fade-in stagger-${i + 2}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`tag-badge ${item.categoryColor} text-white`}>{item.category}</span>
                </div>
                <h3 className="news-headline text-base text-portal-ink mb-2 cursor-pointer hover:text-portal-navy transition-colors">
                  {item.title}
                </h3>
                <p className="font-ptserif text-xs text-portal-gray leading-relaxed mb-3">{item.summary}</p>
                <div className="flex items-center justify-between">
                  <span className="news-meta">{item.date} · {item.author}</span>
                  <button className="font-ptsans text-xs text-portal-navy hover:underline">Читать →</button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="section-block animate-fade-in stagger-5">
          <div className="portal-section-title">Комментарии читателей</div>
          <div className="bg-amber-50 border border-amber-200 p-3 mb-4">
            <p className="font-ptsans text-xs text-amber-800">
              <Icon name="Shield" size={12} className="inline mr-1" />
              Все комментарии проходят предварительную модерацию перед публикацией.
            </p>
          </div>
          <div className="space-y-4 mb-5">
            {comments.map((c: Comment) => (
              <div key={c.id} className="border-b border-portal-gray-light pb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 bg-portal-navy rounded-full flex items-center justify-center">
                    <span className="font-ptsans text-[10px] font-bold text-white">{c.author[0]}</span>
                  </div>
                  <span className="font-ptsans text-xs font-bold text-portal-ink">{c.author}</span>
                  <span className="font-ptsans text-xs text-portal-gray">{c.date}</span>
                  <span className="inline-block font-ptsans text-[9px] font-bold tracking-widest uppercase bg-green-700 text-white px-2 py-0.5">опубликован</span>
                </div>
                <p className="font-ptserif text-sm text-portal-ink-light ml-9">{c.text}</p>
              </div>
            ))}
          </div>

          {pendingComment ? (
            <div className="bg-green-50 border border-green-200 p-4 text-center">
              <Icon name="Clock" size={16} className="inline mr-2 text-green-700" />
              <span className="font-ptsans text-sm text-green-800">Ваш комментарий отправлен на модерацию</span>
            </div>
          ) : (
            <form onSubmit={handleCommentSubmit} className="border border-portal-gray-light p-4 bg-portal-paper">
              <div className="font-ptsans text-xs font-bold text-portal-navy mb-2 uppercase tracking-wide">Оставить комментарий</div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Ваш комментарий..."
                className="w-full font-ptserif text-sm border border-portal-gray-light p-3 resize-none h-24 focus:outline-none focus:border-portal-navy bg-white"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="font-ptsans text-[11px] text-portal-gray">Имя и e-mail будут запрошены при публикации</span>
                <button type="submit" className="btn-primary">Отправить</button>
              </div>
            </form>
          )}
        </div>
      </div>

      <aside>
        <div className="sidebar-widget mb-5 animate-fade-in stagger-2">
          <div className="sidebar-widget-header">Погода в городе</div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-playfair text-4xl font-bold text-portal-navy">+14°</div>
                <div className="font-ptsans text-xs text-portal-gray">Переменная облачность</div>
              </div>
              <Icon name="Cloud" size={40} className="text-portal-gray" />
            </div>
            <div className="single-rule mb-3" />
            <div className="grid grid-cols-4 gap-1 text-center">
              {[
                { day: "Ср", t: "+14", icon: "Cloud" },
                { day: "Чт", t: "+11", icon: "CloudRain" },
                { day: "Пт", t: "+9", icon: "CloudRain" },
                { day: "Сб", t: "+16", icon: "Sun" },
              ].map(w => (
                <div key={w.day} className="font-ptsans text-xs">
                  <div className="text-portal-gray text-[10px] mb-1">{w.day}</div>
                  <Icon name={w.icon} size={16} className="mx-auto text-portal-navy mb-1" />
                  <div className="font-bold text-portal-navy">{w.t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sidebar-widget animate-fade-in stagger-3">
          <div className="sidebar-widget-header">Афиша — ближайшие события</div>
          <div className="p-3">
            {EVENTS.slice(0, 4).map((ev, i) => (
              <div key={i} className="flex gap-3 mb-3 pb-3 border-b border-portal-gray-light last:border-0 last:mb-0 last:pb-0">
                <div className="flex-shrink-0 bg-portal-navy text-white text-center w-12 py-1">
                  <div className="font-playfair text-lg font-bold leading-none">{ev.date.split(" ")[0]}</div>
                  <div className="font-ptsans text-[9px] uppercase tracking-wide">{ev.date.split(" ")[1]}</div>
                </div>
                <div>
                  <div className="font-ptserif text-xs font-bold text-portal-ink leading-tight mb-0.5 cursor-pointer hover:text-portal-navy">{ev.title}</div>
                  <div className="font-ptsans text-[10px] text-portal-gray">{ev.place} · {ev.time}</div>
                </div>
              </div>
            ))}
            <button className="btn-outline w-full mt-2 text-center">Все события</button>
          </div>
        </div>

        <div className="sidebar-widget mt-5 animate-fade-in stagger-4">
          <div className="sidebar-widget-header">Объявления</div>
          <div className="p-3">
            {ANNOUNCEMENTS.slice(0, 3).map((a) => (
              <div key={a.id} className="mb-3 pb-3 border-b border-portal-gray-light last:border-0 last:mb-0 last:pb-0">
                <div className="font-ptsans text-[10px] text-portal-gray uppercase tracking-wide mb-0.5">{a.category}</div>
                <div className="font-ptserif text-xs text-portal-ink cursor-pointer hover:text-portal-navy leading-tight mb-0.5">{a.title}</div>
                <div className="font-ptsans text-xs font-bold text-portal-navy">{a.price}</div>
              </div>
            ))}
            <button className="btn-outline w-full mt-2 text-center">Все объявления</button>
          </div>
        </div>

        <div className="sidebar-widget mt-5 animate-fade-in stagger-5">
          <div className="sidebar-widget-header">Рубрики</div>
          <div className="p-3">
            {RUBRICS.map((r) => (
              <div key={r.name} className="flex items-center justify-between py-1.5 border-b border-portal-gray-light last:border-0 cursor-pointer group">
                <div className="flex items-center gap-2">
                  <Icon name={r.icon} size={13} className="text-portal-gold" />
                  <span className="font-ptsans text-xs text-portal-ink group-hover:text-portal-navy transition-colors">{r.name}</span>
                </div>
                <span className="font-ptsans text-[10px] text-portal-gray">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function NewsPage() {
  const [activeFilter, setActiveFilter] = useState("Все");
  const categories = ["Все", "Городское хозяйство", "Политика", "Экономика", "Образование", "Социальная сфера"];

  return (
    <div>
      <div className="double-rule mb-1" />
      <div className="portal-section-title mt-3">Новости города</div>
      <div className="flex flex-wrap gap-2 mb-5">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setActiveFilter(c)}
            className={`font-ptsans text-xs tracking-wide uppercase px-3 py-1.5 border transition-colors ${activeFilter === c ? "bg-portal-navy text-white border-portal-navy" : "border-portal-gray-light text-portal-ink hover:border-portal-navy"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {NEWS.map((item) => (
          <article key={item.id} className="bg-white border border-portal-gray-light overflow-hidden">
            {item.image && <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`tag-badge ${item.categoryColor} text-white`}>{item.category}</span>
                <span className="news-meta">{item.date}</span>
              </div>
              <h3 className="news-headline text-lg text-portal-ink mb-2 cursor-pointer hover:text-portal-navy">{item.title}</h3>
              <p className="font-ptserif text-sm text-portal-gray leading-relaxed mb-3">{item.summary}</p>
              <div className="flex items-center justify-between">
                <span className="news-meta">Автор: {item.author}</span>
                <button className="btn-primary text-xs">Читать →</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function RubricsPage() {
  return (
    <div>
      <div className="double-rule mb-1" />
      <div className="portal-section-title mt-3">Рубрики</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {RUBRICS.map((r) => (
          <div key={r.name} className="bg-white border border-portal-gray-light p-5 cursor-pointer hover:border-portal-navy hover:shadow-sm transition-all group">
            <div className="w-12 h-12 bg-portal-navy flex items-center justify-center mb-4 group-hover:bg-portal-navy-light transition-colors">
              <Icon name={r.icon} size={22} className="text-portal-gold-light" />
            </div>
            <div className="font-playfair text-base font-bold text-portal-ink group-hover:text-portal-navy mb-1">{r.name}</div>
            <div className="font-ptsans text-xs text-portal-gray">{r.count} материалов</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutCityPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      <div>
        <div className="double-rule mb-1" />
        <div className="portal-section-title mt-3">О городе</div>
        <div className="bg-white border border-portal-gray-light overflow-hidden mb-5">
          <img src={HERO_IMAGE} alt="Город" className="w-full h-72 object-cover" />
        </div>
        <div className="bg-white border border-portal-gray-light p-6">
          <h2 className="font-playfair text-2xl font-bold text-portal-navy mb-4">История и настоящее</h2>
          <p className="font-ptserif text-sm text-portal-ink-light leading-relaxed mb-4">
            Наш город основан в 1748 году как форпост на границе освоенных земель. За прошедшие столетия он превратился в крупный промышленный и культурный центр региона с развитой инфраструктурой и богатой историей.
          </p>
          <p className="font-ptserif text-sm text-portal-ink-light leading-relaxed mb-4">
            Сегодня в городе проживает более 342 тысяч человек. Развитая промышленность, образовательные учреждения, учреждения культуры и здравоохранения делают город привлекательным для жизни и инвестиций.
          </p>
          <p className="font-ptserif text-sm text-portal-ink-light leading-relaxed">
            Город входит в число лидеров региона по качеству жизни, уровню образования и доступности медицинской помощи. Ежегодно здесь реализуются десятки социальных и инфраструктурных проектов.
          </p>
        </div>
      </div>
      <aside>
        <div className="sidebar-widget">
          <div className="sidebar-widget-header">Город в цифрах</div>
          <div className="p-4 space-y-4">
            {[
              { label: "Население", value: ABOUT_CITY.population, icon: "Users" },
              { label: "Год основания", value: ABOUT_CITY.founded, icon: "Calendar" },
              { label: "Площадь", value: ABOUT_CITY.area, icon: "Map" },
              { label: "Районов", value: ABOUT_CITY.districts, icon: "Building" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-4 pb-4 border-b border-portal-gray-light last:border-0 last:pb-0">
                <div className="w-10 h-10 bg-portal-navy flex items-center justify-center flex-shrink-0">
                  <Icon name={item.icon} size={18} className="text-portal-gold-light" />
                </div>
                <div>
                  <div className="font-playfair text-xl font-bold text-portal-navy">{item.value}</div>
                  <div className="font-ptsans text-xs text-portal-gray uppercase tracking-wide">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function AfishaPage() {
  return (
    <div>
      <div className="double-rule mb-1" />
      <div className="portal-section-title mt-3">Афиша города</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 bg-white border border-portal-gray-light overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <img src={CULTURE_IMAGE} alt="Концерт" className="w-full sm:w-64 h-48 sm:h-auto object-cover flex-shrink-0" />
            <div className="p-6">
              <span className="tag-badge-gold mb-3 inline-block">Рекомендуем</span>
              <h2 className="font-playfair text-2xl font-bold text-portal-navy mb-2">Концерт городского симфонического оркестра</h2>
              <p className="font-ptserif text-sm text-portal-gray mb-4">Торжественный концерт в честь Дня города. В программе — произведения Чайковского, Шостаковича и Прокофьева.</p>
              <div className="flex flex-wrap gap-4 mb-4">
                <span className="flex items-center gap-1.5 font-ptsans text-xs text-portal-ink"><Icon name="Calendar" size={13} className="text-portal-gold" /> 13 мая 2026</span>
                <span className="flex items-center gap-1.5 font-ptsans text-xs text-portal-ink"><Icon name="Clock" size={13} className="text-portal-gold" /> 19:00</span>
                <span className="flex items-center gap-1.5 font-ptsans text-xs text-portal-ink"><Icon name="MapPin" size={13} className="text-portal-gold" /> Дом культуры</span>
              </div>
              <button className="btn-primary">Подробнее о событии</button>
            </div>
          </div>
        </div>
        {EVENTS.slice(1).map((ev, i) => (
          <div key={i} className="bg-white border border-portal-gray-light p-5">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 bg-portal-navy text-white text-center w-14 py-2 px-1">
                <div className="font-playfair text-2xl font-black leading-none">{ev.date.split(" ")[0]}</div>
                <div className="font-ptsans text-[10px] uppercase tracking-wide">{ev.date.split(" ")[1]}</div>
              </div>
              <div>
                <h3 className="font-playfair text-lg font-bold text-portal-ink mb-1 cursor-pointer hover:text-portal-navy">{ev.title}</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="flex items-center gap-1 font-ptsans text-xs text-portal-gray"><Icon name="Clock" size={11} /> {ev.time}</span>
                  <span className="flex items-center gap-1 font-ptsans text-xs text-portal-gray"><Icon name="MapPin" size={11} /> {ev.place}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnnouncementsPage() {
  const categories = ["Все", "Недвижимость", "Работа", "Услуги", "Продажа", "Аренда"];
  const [active, setActive] = useState("Все");
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="double-rule mb-1" />
      <div className="flex items-center justify-between mt-3 mb-4">
        <div className="portal-section-title mb-0">Объявления</div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Icon name="Plus" size={14} />
          Подать объявление
        </button>
      </div>

      {showForm && (
        <div className="bg-amber-50 border border-amber-200 p-4 mb-5">
          <div className="font-ptsans text-xs font-bold text-amber-800 uppercase tracking-wide mb-3">Новое объявление (модерация 1–2 рабочих дня)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Заголовок объявления" className="font-ptserif text-sm border border-portal-gray-light p-2.5 bg-white focus:outline-none focus:border-portal-navy col-span-2" />
            <select className="font-ptsans text-sm border border-portal-gray-light p-2.5 bg-white focus:outline-none focus:border-portal-navy">
              {categories.slice(1).map(c => <option key={c}>{c}</option>)}
            </select>
            <input placeholder="Цена / условие" className="font-ptserif text-sm border border-portal-gray-light p-2.5 bg-white focus:outline-none focus:border-portal-navy" />
            <textarea placeholder="Описание объявления..." className="font-ptserif text-sm border border-portal-gray-light p-2.5 bg-white focus:outline-none focus:border-portal-navy resize-none h-20 col-span-2" />
            <input placeholder="Контактный телефон" className="font-ptserif text-sm border border-portal-gray-light p-2.5 bg-white focus:outline-none focus:border-portal-navy" />
            <input placeholder="Ваше имя" className="font-ptserif text-sm border border-portal-gray-light p-2.5 bg-white focus:outline-none focus:border-portal-navy" />
          </div>
          <button className="btn-primary mt-3">Отправить на модерацию</button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-5">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`font-ptsans text-xs uppercase tracking-wide px-3 py-1.5 border transition-colors ${active === c ? "bg-portal-navy text-white border-portal-navy" : "border-portal-gray-light text-portal-ink hover:border-portal-navy"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ANNOUNCEMENTS.map((a) => (
          <div key={a.id} className="bg-white border border-portal-gray-light p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="tag-badge">{a.category}</span>
              <span className="font-ptsans text-[11px] text-portal-gray">{a.date}</span>
            </div>
            <h3 className="font-playfair text-lg font-bold text-portal-ink mb-2 cursor-pointer hover:text-portal-navy">{a.title}</h3>
            <div className="flex items-center justify-between">
              <span className="font-playfair text-xl font-bold text-portal-navy">{a.price}</span>
              <button className="btn-outline text-xs">Связаться</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactsPage() {
  return (
    <div>
      <div className="double-rule mb-1" />
      <div className="portal-section-title mt-3">Контакты редакции</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-portal-gray-light p-6">
          <h2 className="font-playfair text-xl font-bold text-portal-navy mb-5">Реквизиты и адрес</h2>
          <div className="space-y-4">
            {[
              { icon: "MapPin", label: "Адрес редакции", value: "ул. Советская, д. 1, кабинет 204" },
              { icon: "Phone", label: "Телефон", value: "+7 (000) 000-00-00" },
              { icon: "Mail", label: "Электронная почта", value: "redakciya@gorodvestnik.ru" },
              { icon: "Clock", label: "Режим работы", value: "Пн–Пт: 9:00–18:00, Сб: 10:00–14:00" },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-4 pb-4 border-b border-portal-gray-light last:border-0 last:pb-0">
                <div className="w-9 h-9 bg-portal-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name={item.icon} size={15} className="text-portal-gold-light" />
                </div>
                <div>
                  <div className="font-ptsans text-[11px] uppercase tracking-wide text-portal-gray mb-0.5">{item.label}</div>
                  <div className="font-ptserif text-sm text-portal-ink">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-portal-gray-light p-6">
          <h2 className="font-playfair text-xl font-bold text-portal-navy mb-5">Написать в редакцию</h2>
          <div className="space-y-3">
            <input placeholder="Ваше имя" className="w-full font-ptserif text-sm border border-portal-gray-light p-3 focus:outline-none focus:border-portal-navy bg-portal-paper" />
            <input placeholder="Электронная почта" className="w-full font-ptserif text-sm border border-portal-gray-light p-3 focus:outline-none focus:border-portal-navy bg-portal-paper" />
            <select className="w-full font-ptsans text-sm border border-portal-gray-light p-3 focus:outline-none focus:border-portal-navy bg-portal-paper text-portal-gray">
              <option>Новость / информация</option>
              <option>Жалоба / обращение</option>
              <option>Реклама</option>
              <option>Вопрос редакции</option>
            </select>
            <textarea placeholder="Текст сообщения..." className="w-full font-ptserif text-sm border border-portal-gray-light p-3 resize-none h-28 focus:outline-none focus:border-portal-navy bg-portal-paper" />
            <div className="flex items-start gap-2">
              <input type="checkbox" id="agree" className="mt-0.5" />
              <label htmlFor="agree" className="font-ptsans text-xs text-portal-gray">Я согласен с политикой обработки персональных данных</label>
            </div>
            <button className="btn-primary w-full text-center">Отправить сообщение</button>
          </div>
        </div>
      </div>
    </div>
  );
}