interface Env {
  DB: D1Database;
}

interface Comment {
  id: number;
  slug: string;
  nickname: string;
  email: string;
  browser_id: string;
  content: string;
  created_at: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function ensureTable(db: D1Database) {
  await db.prepare('CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL, nickname TEXT NOT NULL, email TEXT DEFAULT \'\', browser_id TEXT DEFAULT \'\', content TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)').run();
  try { await db.prepare('ALTER TABLE comments ADD COLUMN email TEXT DEFAULT \'\'').run(); } catch {}
  try { await db.prepare('ALTER TABLE comments ADD COLUMN browser_id TEXT DEFAULT \'\'').run(); } catch {}
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const slug = url.searchParams.get('slug');
  const admin = url.searchParams.get('admin');

  await ensureTable(context.env.DB);

  // Admin mode: return all comments
  if (admin === '1') {
    const { results } = await context.env.DB
      .prepare('SELECT * FROM comments ORDER BY created_at DESC')
      .all<Comment>();
    return Response.json(results, { headers: CORS_HEADERS });
  }

  if (!slug) {
    return Response.json({ error: '缺少 slug 参数' }, { status: 400, headers: CORS_HEADERS });
  }

  const { results } = await context.env.DB
    .prepare('SELECT id, slug, nickname, content, created_at FROM comments WHERE slug = ? ORDER BY created_at DESC')
    .bind(slug)
    .all();

  return Response.json(results, { headers: CORS_HEADERS });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: { slug?: string; nickname?: string; email?: string; browser_id?: string; content?: string };
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: '无效的 JSON' }, { status: 400, headers: CORS_HEADERS });
  }

  const { slug, nickname, email, browser_id, content } = body;
  if (!slug || !nickname || !content) {
    return Response.json({ error: '缺少必填字段' }, { status: 400, headers: CORS_HEADERS });
  }
  if (nickname.length > 50) {
    return Response.json({ error: '昵称最长 50 字' }, { status: 400, headers: CORS_HEADERS });
  }
  if (email && email.length > 100) {
    return Response.json({ error: '邮箱最长 100 字' }, { status: 400, headers: CORS_HEADERS });
  }
  if (content.length > 2000) {
    return Response.json({ error: '内容最长 2000 字' }, { status: 400, headers: CORS_HEADERS });
  }

  await ensureTable(context.env.DB);
  await context.env.DB
    .prepare('INSERT INTO comments (slug, nickname, email, browser_id, content) VALUES (?, ?, ?, ?, ?)')
    .bind(slug, nickname.trim(), (email || '').trim(), (browser_id || '').trim(), content.trim())
    .run();

  return Response.json({ ok: true }, { headers: CORS_HEADERS });
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  let body: { id?: number };
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: '无效的 JSON' }, { status: 400, headers: CORS_HEADERS });
  }

  if (!body.id) {
    return Response.json({ error: '缺少评论 ID' }, { status: 400, headers: CORS_HEADERS });
  }

  await ensureTable(context.env.DB);
  await context.env.DB
    .prepare('DELETE FROM comments WHERE id = ?')
    .bind(body.id)
    .run();

  return Response.json({ ok: true }, { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: CORS_HEADERS });
};
