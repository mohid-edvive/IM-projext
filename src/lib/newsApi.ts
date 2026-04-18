// Real market news via GDELT 2.0 DOC API — no auth, no key, free.
// Docs: https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/

export interface NewsArticle {
  id: number;
  category: string;
  datetime: number; // unix seconds
  headline: string;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

interface GdeltArticle {
  url: string;
  url_mobile?: string;
  title: string;
  seendate: string; // YYYYMMDDTHHMMSSZ
  socialimage?: string;
  domain: string;
  language: string;
  sourcecountry?: string;
}

function parseGdeltDate(s: string): number {
  // "20250418T123456Z"
  const y = +s.slice(0, 4);
  const mo = +s.slice(4, 6) - 1;
  const d = +s.slice(6, 8);
  const h = +s.slice(9, 11);
  const mi = +s.slice(11, 13);
  const se = +s.slice(13, 15);
  return Math.floor(Date.UTC(y, mo, d, h, mi, se) / 1000);
}

function hashId(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Simple in-memory cache to respect GDELT rate limits (~1 req / 5s)
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min
const cache = new Map<string, { ts: number; data: NewsArticle[] }>();

async function gdeltSearch(query: string, max = 50): Promise<NewsArticle[]> {
  const cacheKey = `${query}::${max}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.ts < CACHE_TTL_MS) return hit.data;

  const url =
    `https://api.gdeltproject.org/api/v2/doc/doc?` +
    `query=${encodeURIComponent(query)}&mode=ArtList&maxrecords=${max}` +
    `&format=json&sort=DateDesc&sourcelang=english`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GDELT error: ${res.status}`);
  const text = await res.text();
  // GDELT sometimes returns invalid JSON when empty
  let data: { articles?: GdeltArticle[] };
  try {
    data = JSON.parse(text);
  } catch {
    return [];
  }
  const articles = data.articles ?? [];
  const result: NewsArticle[] = articles.map((a) => ({
    id: hashId(a.url),
    category: "general",
    datetime: parseGdeltDate(a.seendate),
    headline: a.title,
    image: a.socialimage ?? "",
    related: "",
    source: a.domain,
    summary: "",
    url: a.url,
  }));
  cache.set(cacheKey, { ts: Date.now(), data: result });
  return result;
}

export async function fetchMarketNews(_category: string = "general"): Promise<NewsArticle[]> {
  try {
    // Curated finance query — major outlets, market topics
    const query =
      '(stocks OR "stock market" OR "S&P 500" OR Nasdaq OR "Federal Reserve" OR earnings OR inflation OR bitcoin OR crypto) ' +
      '(domain:reuters.com OR domain:bloomberg.com OR domain:cnbc.com OR domain:wsj.com OR domain:ft.com OR domain:marketwatch.com OR domain:finance.yahoo.com OR domain:investing.com)';
    return await gdeltSearch(query, 50);
  } catch (err) {
    console.error("Failed to fetch market news:", err);
    return [];
  }
}

export async function fetchCompanyNews(
  symbol: string,
  _from?: string,
  _to?: string,
): Promise<NewsArticle[]> {
  try {
    const query =
      `("${symbol}" OR "$${symbol}") ` +
      '(domain:reuters.com OR domain:bloomberg.com OR domain:cnbc.com OR domain:wsj.com OR domain:marketwatch.com OR domain:finance.yahoo.com OR domain:investing.com OR domain:seekingalpha.com)';
    return await gdeltSearch(query, 25);
  } catch (err) {
    console.error("Failed to fetch company news:", err);
    return [];
  }
}

export async function fetchMarketSentiment(_symbol: string) {
  // GDELT doesn't expose per-symbol sentiment via this endpoint; return null gracefully.
  return null;
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor(Date.now() / 1000 - timestamp);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(timestamp * 1000).toLocaleDateString();
}
