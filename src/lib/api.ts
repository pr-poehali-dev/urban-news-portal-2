const BASE = "https://functions.poehali.dev/27d4ff6a-114e-42ba-89fc-9066776328f7";

function url(action: string, params?: Record<string, string>) {
  const q = new URLSearchParams({ action, ...params });
  return `${BASE}?${q}`;
}

async function get<T>(action: string, params?: Record<string, string>): Promise<T> {
  const r = await fetch(url(action, params));
  return r.json();
}

async function post<T>(action: string, body: unknown, params?: Record<string, string>, adminToken?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (adminToken) headers["X-Admin-Token"] = adminToken;
  const r = await fetch(url(action, params), { method: "POST", headers, body: JSON.stringify(body) });
  return r.json();
}

async function patch<T>(action: string, id: string, body: unknown, adminToken: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json", "X-Admin-Token": adminToken };
  const r = await fetch(url(action, { id }), { method: "PATCH", headers, body: JSON.stringify(body) });
  return r.json();
}

async function put<T>(action: string, id: string, body: unknown, adminToken: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json", "X-Admin-Token": adminToken };
  const r = await fetch(url(action, { id }), { method: "PUT", headers, body: JSON.stringify(body) });
  return r.json();
}

async function del(action: string, id: string, adminToken: string) {
  const headers: Record<string, string> = { "X-Admin-Token": adminToken };
  await fetch(url(action, { id }), { method: "DELETE", headers });
}

// ── Public API ──────────────────────────────────────────────────────────────

export const api = {
  // News
  getNews: () => get<NewsItem[]>("news"),
  getNewsAdmin: (token: string) => fetch(url("news"), { headers: { "X-Admin-Token": token } }).then(r => r.json()) as Promise<NewsItem[]>,
  createNews: (data: Partial<NewsItem>, token: string) => post<NewsItem>("news", data, undefined, token),
  updateNews: (id: number, data: Partial<NewsItem>, token: string) => put<NewsItem>("news", String(id), data, token),
  deleteNews: (id: number, token: string) => del("news", String(id), token),

  // Comments
  getComments: (newsId?: number) => get<CommentItem[]>("comments", newsId ? { news_id: String(newsId) } : undefined),
  getCommentsAdmin: (token: string) => fetch(url("comments"), { headers: { "X-Admin-Token": token } }).then(r => r.json()) as Promise<CommentItem[]>,
  addComment: (data: { news_id?: number; author: string; text: string }) => post<CommentItem>("comments", data),
  moderateComment: (id: number, status: "approved" | "rejected", token: string) => patch("comments", String(id), { status }, token),

  // Events
  getEvents: () => get<EventItem[]>("events"),
  createEvent: (data: Partial<EventItem>, token: string) => post<EventItem>("events", data, undefined, token),
  updateEvent: (id: number, data: Partial<EventItem>, token: string) => put<EventItem>("events", String(id), data, token),
  deleteEvent: (id: number, token: string) => del("events", String(id), token),

  // Announcements
  getAnnouncements: () => get<AnnouncementItem[]>("announcements"),
  getAnnouncementsAdmin: (token: string) => fetch(url("announcements"), { headers: { "X-Admin-Token": token } }).then(r => r.json()) as Promise<AnnouncementItem[]>,
  addAnnouncement: (data: Partial<AnnouncementItem>) => post<AnnouncementItem>("announcements", data),
  moderateAnnouncement: (id: number, status: "approved" | "rejected", token: string) => patch("announcements", String(id), { status }, token),

  // Forum
  getTopics: (category?: string) => get<ForumTopic[]>("forum_topics", category ? { category } : undefined),
  createTopic: (data: { category: string; title: string; author: string; text?: string }) => post<ForumTopic>("forum_topics", data),
  viewTopic: (id: number) => post("forum_topics", {}, { id: String(id), sub: "views" }),
  getReplies: (topicId: number) => get<ForumReply[]>("forum_replies", { id: String(topicId) }),
  addReply: (data: { topic_id: number; author: string; text: string }) => post<ForumReply>("forum_replies", data),
  likeReply: (id: number) => post("forum_replies", {}, { id: String(id), sub: "like" }),

  // Stats (admin)
  getStats: (token: string) => fetch(url("stats"), { headers: { "X-Admin-Token": token } }).then(r => r.json()),
};

// ── Types ───────────────────────────────────────────────────────────────────

export interface NewsItem {
  id: number;
  category: string;
  title: string;
  summary: string;
  author: string;
  status: "draft" | "published";
  views: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommentItem {
  id: number;
  news_id: number | null;
  author: string;
  body: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface EventItem {
  id: number;
  event_date: string;
  title: string;
  place: string;
  event_time: string;
  created_at: string;
}

export interface AnnouncementItem {
  id: number;
  category: string;
  title: string;
  price: string;
  contact: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface ForumTopic {
  id: number;
  category: string;
  title: string;
  author: string;
  pinned: boolean;
  views: number;
  created_at: string;
  reply_count: number;
  last_reply_author: string | null;
  last_reply_date: string | null;
}

export interface ForumReply {
  id: number;
  topic_id: number;
  author: string;
  body: string;
  likes: number;
  created_at: string;
}

export const ADMIN_TOKEN_KEY = "portal_admin_token";
export const ADMIN_TOKEN_VALUE = "secret-admin-token";
