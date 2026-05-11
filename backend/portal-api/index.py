"""
Единый API городского портала: новости, события, объявления, форум, комментарии, CMS.
Маршрутизация через query-параметр action=<resource>.
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
}
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "secret-admin-token")
S = "t_p23033279_urban_news_portal_2"  # schema prefix


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data, status=200):
    return {
        "statusCode": status,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps(data, ensure_ascii=False, default=str),
    }


def err(msg, status=400):
    return {
        "statusCode": status,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps({"error": msg}, ensure_ascii=False),
    }


def is_admin(event):
    token = (event.get("headers") or {}).get("X-Admin-Token", "")
    return token == ADMIN_TOKEN


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")
    resource_id = qs.get("id", "")
    sub = qs.get("sub", "")

    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    # ── NEWS ──────────────────────────────────────────────────────────────────
    if action == "news" and method == "GET" and not resource_id:
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if is_admin(event):
                    cur.execute("SELECT * FROM t_p23033279_urban_news_portal_2.news ORDER BY created_at DESC")
                else:
                    cur.execute("SELECT * FROM t_p23033279_urban_news_portal_2.news WHERE status='published' ORDER BY created_at DESC")
                return ok(list(cur.fetchall()))

    if action == "news" and method == "POST" and not resource_id:
        if not is_admin(event):
            return err("Unauthorized", 401)
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "INSERT INTO t_p23033279_urban_news_portal_2.news (category,title,summary,author,status,image_url) VALUES (%s,%s,%s,%s,%s,%s) RETURNING *",
                    (body.get("category",""), body.get("title",""), body.get("summary",""),
                     body.get("author","Редакция"), body.get("status","draft"), body.get("image_url"))
                )
                conn.commit()
                return ok(dict(cur.fetchone()), 201)

    if action == "news" and method in ("PUT","PATCH") and resource_id:
        if not is_admin(event):
            return err("Unauthorized", 401)
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "UPDATE t_p23033279_urban_news_portal_2.news SET category=%s,title=%s,summary=%s,author=%s,status=%s,updated_at=NOW() WHERE id=%s RETURNING *",
                    (body.get("category"), body.get("title"), body.get("summary"),
                     body.get("author"), body.get("status"), resource_id)
                )
                conn.commit()
                row = cur.fetchone()
                if not row:
                    return err("Not found", 404)
                return ok(dict(row))

    if action == "news" and method == "DELETE" and resource_id:
        if not is_admin(event):
            return err("Unauthorized", 401)
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute("UPDATE t_p23033279_urban_news_portal_2.news SET status='draft' WHERE id=%s", (resource_id,))
                conn.commit()
        return ok({"ok": True})

    if action == "news" and sub == "views" and method == "POST" and resource_id:
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("UPDATE t_p23033279_urban_news_portal_2.news SET views=views+1 WHERE id=%s RETURNING views", (resource_id,))
                conn.commit()
                row = cur.fetchone()
                return ok({"views": row["views"] if row else 0})

    # ── COMMENTS ──────────────────────────────────────────────────────────────
    if action == "comments" and method == "GET":
        news_id = qs.get("news_id")
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if is_admin(event):
                    cur.execute("SELECT * FROM t_p23033279_urban_news_portal_2.comments ORDER BY created_at DESC")
                elif news_id:
                    cur.execute("SELECT * FROM t_p23033279_urban_news_portal_2.comments WHERE news_id=%s AND status='approved' ORDER BY created_at", (news_id,))
                else:
                    cur.execute("SELECT * FROM t_p23033279_urban_news_portal_2.comments WHERE status='approved' ORDER BY created_at DESC LIMIT 20")
                return ok(list(cur.fetchall()))

    if action == "comments" and method == "POST":
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "INSERT INTO t_p23033279_urban_news_portal_2.comments (news_id,author,body) VALUES (%s,%s,%s) RETURNING *",
                    (body.get("news_id"), body.get("author","Аноним"), body.get("text",""))
                )
                conn.commit()
                return ok(dict(cur.fetchone()), 201)

    if action == "comments" and method == "PATCH" and resource_id:
        if not is_admin(event):
            return err("Unauthorized", 401)
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("UPDATE t_p23033279_urban_news_portal_2.comments SET status=%s WHERE id=%s RETURNING *", (body.get("status","approved"), resource_id))
                conn.commit()
                row = cur.fetchone()
                return ok(dict(row) if row else {})

    # ── EVENTS ────────────────────────────────────────────────────────────────
    if action == "events" and method == "GET":
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT * FROM t_p23033279_urban_news_portal_2.events ORDER BY created_at")
                return ok(list(cur.fetchall()))

    if action == "events" and method == "POST":
        if not is_admin(event):
            return err("Unauthorized", 401)
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "INSERT INTO t_p23033279_urban_news_portal_2.events (event_date,title,place,event_time) VALUES (%s,%s,%s,%s) RETURNING *",
                    (body.get("date",""), body.get("title",""), body.get("place",""), body.get("time",""))
                )
                conn.commit()
                return ok(dict(cur.fetchone()), 201)

    if action == "events" and method == "PUT" and resource_id:
        if not is_admin(event):
            return err("Unauthorized", 401)
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "UPDATE t_p23033279_urban_news_portal_2.events SET event_date=%s,title=%s,place=%s,event_time=%s WHERE id=%s RETURNING *",
                    (body.get("date"), body.get("title"), body.get("place"), body.get("time"), resource_id)
                )
                conn.commit()
                row = cur.fetchone()
                return ok(dict(row) if row else {})

    if action == "events" and method == "DELETE" and resource_id:
        if not is_admin(event):
            return err("Unauthorized", 401)
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute("UPDATE t_p23033279_urban_news_portal_2.events SET title=CONCAT('[удалено] ', title) WHERE id=%s", (resource_id,))
                conn.commit()
        return ok({"ok": True})

    # ── ANNOUNCEMENTS ─────────────────────────────────────────────────────────
    if action == "announcements" and method == "GET":
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if is_admin(event):
                    cur.execute("SELECT * FROM t_p23033279_urban_news_portal_2.announcements ORDER BY created_at DESC")
                else:
                    cur.execute("SELECT * FROM t_p23033279_urban_news_portal_2.announcements WHERE status='approved' ORDER BY created_at DESC")
                return ok(list(cur.fetchall()))

    if action == "announcements" and method == "POST":
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "INSERT INTO t_p23033279_urban_news_portal_2.announcements (category,title,price,contact) VALUES (%s,%s,%s,%s) RETURNING *",
                    (body.get("category",""), body.get("title",""), body.get("price",""), body.get("contact",""))
                )
                conn.commit()
                return ok(dict(cur.fetchone()), 201)

    if action == "announcements" and method == "PATCH" and resource_id:
        if not is_admin(event):
            return err("Unauthorized", 401)
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("UPDATE t_p23033279_urban_news_portal_2.announcements SET status=%s WHERE id=%s RETURNING *", (body.get("status","approved"), resource_id))
                conn.commit()
                row = cur.fetchone()
                return ok(dict(row) if row else {})

    # ── FORUM TOPICS ──────────────────────────────────────────────────────────
    if action == "forum_topics" and method == "GET" and not resource_id:
        category = qs.get("category")
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                base = """
                    SELECT t.*,
                        (SELECT COUNT(*) FROM t_p23033279_urban_news_portal_2.forum_replies r WHERE r.topic_id=t.id) AS reply_count,
                        (SELECT r.author FROM t_p23033279_urban_news_portal_2.forum_replies r WHERE r.topic_id=t.id ORDER BY r.created_at DESC LIMIT 1) AS last_reply_author,
                        (SELECT r.created_at FROM t_p23033279_urban_news_portal_2.forum_replies r WHERE r.topic_id=t.id ORDER BY r.created_at DESC LIMIT 1) AS last_reply_date
                    FROM t_p23033279_urban_news_portal_2.forum_topics t
                """
                if category:
                    cur.execute(base + " WHERE t.category=%s ORDER BY t.pinned DESC, t.created_at DESC", (category,))
                else:
                    cur.execute(base + " ORDER BY t.pinned DESC, t.created_at DESC")
                return ok(list(cur.fetchall()))

    if action == "forum_topics" and method == "POST":
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "INSERT INTO t_p23033279_urban_news_portal_2.forum_topics (category,title,author) VALUES (%s,%s,%s) RETURNING *",
                    (body.get("category","Разное"), body.get("title",""), body.get("author","Аноним"))
                )
                topic = dict(cur.fetchone())
                if body.get("text"):
                    cur.execute(
                        "INSERT INTO t_p23033279_urban_news_portal_2.forum_replies (topic_id,author,body) VALUES (%s,%s,%s)",
                        (topic["id"], body.get("author","Аноним"), body["text"])
                    )
                conn.commit()
                return ok(topic, 201)

    if action == "forum_topics" and sub == "views" and method == "POST" and resource_id:
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("UPDATE t_p23033279_urban_news_portal_2.forum_topics SET views=views+1 WHERE id=%s RETURNING views", (resource_id,))
                conn.commit()
                row = cur.fetchone()
                return ok({"views": row["views"] if row else 0})

    # ── FORUM REPLIES ─────────────────────────────────────────────────────────
    if action == "forum_replies" and method == "GET" and resource_id:
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT * FROM t_p23033279_urban_news_portal_2.forum_replies WHERE topic_id=%s ORDER BY created_at", (resource_id,))
                return ok(list(cur.fetchall()))

    if action == "forum_replies" and method == "POST":
        topic_id = body.get("topic_id") or resource_id
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "INSERT INTO t_p23033279_urban_news_portal_2.forum_replies (topic_id,author,body) VALUES (%s,%s,%s) RETURNING *",
                    (topic_id, body.get("author","Аноним"), body.get("text",""))
                )
                conn.commit()
                return ok(dict(cur.fetchone()), 201)

    if action == "forum_replies" and sub == "like" and method == "POST" and resource_id:
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("UPDATE t_p23033279_urban_news_portal_2.forum_replies SET likes=likes+1 WHERE id=%s RETURNING likes", (resource_id,))
                conn.commit()
                row = cur.fetchone()
                return ok({"likes": row["likes"] if row else 0})

    # ── STATS ─────────────────────────────────────────────────────────────────
    if action == "stats" and method == "GET":
        if not is_admin(event):
            return err("Unauthorized", 401)
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT COUNT(*) AS total, SUM(CASE WHEN status='published' THEN 1 ELSE 0 END) AS published, COALESCE(SUM(views),0) AS views FROM t_p23033279_urban_news_portal_2.news")
                news_stats = dict(cur.fetchone())
                cur.execute("SELECT COUNT(*) AS total FROM t_p23033279_urban_news_portal_2.forum_topics")
                topics_total = int(cur.fetchone()["total"])
                cur.execute("SELECT COUNT(*) AS total FROM t_p23033279_urban_news_portal_2.comments WHERE status='pending'")
                pending_comments = int(cur.fetchone()["total"])
                cur.execute("SELECT COUNT(*) AS total FROM t_p23033279_urban_news_portal_2.announcements WHERE status='pending'")
                pending_ann = int(cur.fetchone()["total"])
                cur.execute("SELECT COUNT(*) AS total FROM t_p23033279_urban_news_portal_2.events")
                events_total = int(cur.fetchone()["total"])
                return ok({
                    "news": news_stats,
                    "forum_topics": topics_total,
                    "pending_comments": pending_comments,
                    "pending_announcements": pending_ann,
                    "events": events_total,
                })

    return err("Not found", 404)