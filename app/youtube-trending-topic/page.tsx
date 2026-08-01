// app/trending/page.tsx
//
// ⚠️ IMPORTANT NOTES (please read before shipping this to production):
// 1. Yeh tool YouTube ki public HTML pages ko scrape karta hai (koi official API use nahi hoti).
//    YouTube apna internal page structure kabhi bhi badal sakta hai — is se scraping toot sakti hai.
//    Jab bhi results ajeeb lagein, sabse pehle yahi wajah check karein.
// 2. RPM / CPC / Earnings kabhi bhi REAL data nahi hote (yeh private AdSense data hai jo sirf
//    channel owner dekh sakta hai). Yahan diya gaya number sirf ANDAZA (estimate) hai, category-wise
//    average industry CPM ranges par based. UI mein ise clearly "Estimated" likha gaya hai.
// 3. Assumes Tailwind CSS already configured hai project mein (Next.js default setup).
// 4. Requires Next.js 14+ (app router) with inline Server Actions support.
//
// Route suggestion: save as app/trending/page.tsx -> /trending par accessible hoga.

export const dynamic = "force-dynamic"; // scraping har request par fresh honi chahiye
export const runtime = "nodejs";

// ---------------------------------------------------------------------------
// Category -> rough industry CPM/RPM ranges (USD per 1000 views). Yeh public
// industry-average estimates hain, exact nahi. Har channel ka actual rate
// audience geography, ad-format, aur niche ke hisaab se alag hota hai.
// ---------------------------------------------------------------------------
const CATEGORY_RPM: Record<string, { low: number; high: number }> = {
  Now: { low: 1, high: 4 },
  Music: { low: 0.5, high: 3 },
  Gaming: { low: 1, high: 4 },
  Movies: { low: 1.5, high: 5 },
  Finance: { low: 8, high: 25 },
  Tech: { low: 4, high: 15 },
  Education: { low: 3, high: 10 },
  Entertainment: { low: 1, high: 5 },
  Other: { low: 1, high: 6 },
};
const CATEGORY_NAMES = Object.keys(CATEGORY_RPM);

// ---------------------------------------------------------------------------
// Helpers: fetch + extract ytInitialData from a raw YouTube HTML page.
// ---------------------------------------------------------------------------
async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        // Desktop browser jaisa User-Agent, warna YouTube kabhi kabhi consent/redirect page deta hai
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        // Cookie consent bypass — warna kai regions (EU/South Asia) se YouTube
        // seedha trending data ke bajaye ek "consent" page bhej deta hai jismein
        // koi video data hota hi nahi.
        Cookie: "CONSENT=YES+1; SOCS=CAI",
      },
      cache: "no-store",
      redirect: "follow",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function extractYtInitialData(html: string): any | null {
  // YouTube kabhi "var ytInitialData = {...};" deta hai, kabhi window["ytInitialData"] = {...};
  const patterns = [
    /var ytInitialData\s*=\s*(\{[\s\S]*?\});<\/script>/,
    /window\["ytInitialData"\]\s*=\s*(\{[\s\S]*?\});<\/script>/,
    /ytInitialData"\]\s*=\s*(\{[\s\S]*?\});/,
  ];
  for (const re of patterns) {
    const match = html.match(re);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch {
        // fall through to next pattern
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Trending page: tabs (Now / Music / Gaming / Movies) + video list per tab.
// ---------------------------------------------------------------------------
type TrendingTab = { title: string; params: string | null };

type TrendingVideo = {
  videoId: string;
  title: string;
  channelName: string;
  channelUrl: string;
  views: string;
  publishedTime: string;
  thumbnail: string;
  videoUrl: string;
};

function getTrendingTabs(data: any): TrendingTab[] {
  try {
    const tabs =
      data?.contents?.twoColumnBrowseResultsRenderer?.tabs ??
      data?.contents?.singleColumnBrowseResultsRenderer?.tabs ??
      [];
    return tabs
      .map((t: any) => t?.tabRenderer)
      .filter(Boolean)
      .map((t: any) => ({
        title: t.title,
        params: t?.endpoint?.browseEndpoint?.params ?? null,
      }));
  } catch {
    return [];
  }
}

function findAllVideoRenderers(node: any, out: any[] = [], depth = 0): any[] {
  if (!node || typeof node !== "object" || depth > 40) return out;
  if (node.videoRenderer) {
    out.push(node.videoRenderer);
  }
  for (const key in node) {
    if (key === "videoRenderer") continue; // already captured above
    const child = node[key];
    if (child && typeof child === "object") {
      findAllVideoRenderers(child, out, depth + 1);
    }
  }
  return out;
}

function getVideosFromTabRenderer(tabRenderer: any): TrendingVideo[] {
  const videos: TrendingVideo[] = [];
  const seen = new Set<string>();
  try {
    const rawRenderers = findAllVideoRenderers(tabRenderer?.content ?? tabRenderer);
    for (const vr of rawRenderers) {
      const videoId = vr.videoId;
      if (!videoId || seen.has(videoId)) continue;
      const title = vr?.title?.runs?.[0]?.text ?? vr?.title?.simpleText ?? "Untitled";
      const channelName =
        vr?.ownerText?.runs?.[0]?.text ??
        vr?.longBylineText?.runs?.[0]?.text ??
        vr?.shortBylineText?.runs?.[0]?.text ??
        "Unknown";
      const channelPath =
        vr?.ownerText?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.canonicalBaseUrl ??
        vr?.longBylineText?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.canonicalBaseUrl ??
        vr?.shortBylineText?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.canonicalBaseUrl ??
        null;
      const views = vr?.viewCountText?.simpleText ?? vr?.shortViewCountText?.simpleText ?? "N/A";
      const publishedTime = vr?.publishedTimeText?.simpleText ?? "";
      const thumbs = vr?.thumbnail?.thumbnails ?? [];
      const thumbnail = thumbs.length ? thumbs[thumbs.length - 1].url : "";

      seen.add(videoId);
      videos.push({
        videoId,
        title,
        channelName,
        channelUrl: channelPath ? `https://www.youtube.com${channelPath}` : "",
        views,
        publishedTime,
        thumbnail,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      });
    }
  } catch {
    // return whatever was collected so far
  }
  return videos;
}

async function getTrendingByCategory(
  categoryTitle?: string
): Promise<{ tabs: TrendingTab[]; videos: TrendingVideo[]; error?: string }> {
  const baseHtml = await fetchHtml("https://www.youtube.com/feed/trending?gl=US&hl=en");
  if (!baseHtml) {
    return { tabs: [], videos: [], error: "YouTube trending page fetch nahi ho saki." };
  }
  const baseData = extractYtInitialData(baseHtml);
  if (!baseData) {
    return {
      tabs: [],
      videos: [],
      error:
        "Page parse nahi ho saka — YouTube ne shayad page structure change kar diya hai.",
    };
  }

  const tabs = getTrendingTabs(baseData);
  const rawTabs =
    baseData?.contents?.twoColumnBrowseResultsRenderer?.tabs ??
    baseData?.contents?.singleColumnBrowseResultsRenderer?.tabs ??
    [];

  if (!rawTabs.length) {
    return {
      tabs: [],
      videos: [],
      error:
        "YouTube ne trending data ke bajaye consent/redirect page bheja — thodi der baad try karein ya server ki region/IP check karein.",
    };
  }

  // Default: pehla tab ("Now")
  let targetTabRenderer = rawTabs?.[0]?.tabRenderer;

  if (categoryTitle) {
    const matchIdx = tabs.findIndex(
      (t) => t.title?.toLowerCase() === categoryTitle.toLowerCase()
    );
    if (matchIdx >= 0) {
      const params = tabs[matchIdx].params;
      if (matchIdx === 0 || !params) {
        targetTabRenderer = rawTabs?.[matchIdx]?.tabRenderer;
      } else {
        // is category ka apna feed fetch karo uske "params" (bp) ke saath
        const catHtml = await fetchHtml(
          `https://www.youtube.com/feed/trending?bp=${encodeURIComponent(params)}&gl=US&hl=en`
        );
        if (catHtml) {
          const catData = extractYtInitialData(catHtml);
          const catTabs =
            catData?.contents?.twoColumnBrowseResultsRenderer?.tabs ??
            catData?.contents?.singleColumnBrowseResultsRenderer?.tabs ??
            [];
          const selected = catTabs.find(
            (t: any) =>
              t?.tabRenderer?.title?.toLowerCase() ===
              categoryTitle.toLowerCase()
          );
          targetTabRenderer = selected?.tabRenderer ?? targetTabRenderer;
        }
      }
    }
  }

  const videos = getVideosFromTabRenderer(targetTabRenderer);
  return { tabs, videos };
}

// ---------------------------------------------------------------------------
// Channel scraping: subscribers, total views, video count (best-effort —
// YouTube ke channel-header ka format 2024 ke baad kai baar badla hai, isliye
// yahan multiple fallback paths try kiye gaye hain).
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Channel scraping: FULL details — subscribers, views, video count, avatar,
// banner, description, join date, country, custom URL, verified badge, and
// external/social links. Best-effort — YouTube ke channel-header ka format
// kai baar badal chuka hai, isliye multiple fallback paths hain.
// ---------------------------------------------------------------------------
type ChannelStats = {
  name: string;
  handle: string;
  subscribers: string;
  totalViews: string;
  videoCount: string;
  description: string;
  joinDate: string;
  country: string;
  verified: boolean;
  avatar: string;
  banner: string;
  links: { title: string; url: string }[];
  error?: string;
};

function normalizeChannelUrl(input: string): string {
  let url = input.trim();
  if (!url.startsWith("http")) {
    url = `https://www.youtube.com/${url.replace(/^@?/, "@")}`;
  }
  return url.replace(/\/$/, "");
}

const EMPTY_CHANNEL: Omit<ChannelStats, "error"> = {
  name: "N/A",
  handle: "N/A",
  subscribers: "N/A",
  totalViews: "N/A",
  videoCount: "N/A",
  description: "",
  joinDate: "N/A",
  country: "N/A",
  verified: false,
  avatar: "",
  banner: "",
  links: [],
};

function regexFirst(str: string, patterns: RegExp[]): string | null {
  for (const re of patterns) {
    const m = str.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}

async function getChannelStats(channelInput: string): Promise<ChannelStats> {
  const base = normalizeChannelUrl(channelInput);
  const html = await fetchHtml(`${base}/about`);
  if (!html) {
    return { ...EMPTY_CHANNEL, error: "Channel page fetch nahi ho saka — link check karein." };
  }
  const data = extractYtInitialData(html);
  if (!data) {
    return { ...EMPTY_CHANNEL, error: "Channel page parse nahi ho saka (structure change ho sakta hai)." };
  }

  try {
    const header =
      data?.header?.c4TabbedHeaderRenderer ??
      data?.header?.pageHeaderRenderer ??
      null;
    const metadata = data?.metadata?.channelMetadataRenderer ?? null;
    const jsonStr = JSON.stringify(data);

    const name = header?.title ?? metadata?.title ?? "Unknown";
    const handle =
      metadata?.vanityChannelUrl?.split("/").pop() ??
      (regexFirst(jsonStr, [/"canonicalChannelUrl":"[^"]*\/(@[^"]+)"/]) ?? "N/A");

    let subscribers =
      header?.subscriberCountText?.simpleText ??
      header?.subscriberCountText?.runs?.[0]?.text ??
      regexFirst(jsonStr, [
        /"subscriberCountText":\{"simpleText":"([^"]+)"/,
        /"subscriberCountText":\{"runs":\[\{"text":"([^"]+)"/,
        /"text":"([\d.,]+[KMB]?\s?subscribers?)"/i,
      ]) ??
      "N/A";

    const totalViews =
      regexFirst(jsonStr, [/"viewCountText":\{"simpleText":"([^"]+)"/]) ?? "N/A";

    const videoCount =
      regexFirst(jsonStr, [
        /"videosCountText":\{"runs":\[\{"text":"([^"]+)"/,
        /"videosCountText":\{"simpleText":"([^"]+)"/,
      ]) ?? "N/A";

    const description =
      metadata?.description ??
      regexFirst(jsonStr, [/"description":"([^"]{1,300})"/]) ??
      "";

    const joinDate =
      regexFirst(jsonStr, [
        /"joinedDateText":\{"content":"([^"]+)"/,
        /"runs":\[\{"text":"Joined ([^"]+)"/,
      ]) ?? "N/A";

    const country =
      metadata?.country ??
      regexFirst(jsonStr, [/"country":"([^"]+)"/]) ??
      "N/A";

    const verified =
      /"BADGE_STYLE_TYPE_VERIFIED"/.test(jsonStr) ||
      /"style":"BADGE_STYLE_TYPE_VERIFIED_ARTIST"/.test(jsonStr);

    const avatar =
      header?.avatar?.thumbnails?.slice(-1)?.[0]?.url ??
      regexFirst(jsonStr, [/"avatar":\{"thumbnails":\[\{"url":"([^"]+)"/]) ??
      "";

    const banner =
      header?.banner?.thumbnails?.slice(-1)?.[0]?.url ??
      regexFirst(jsonStr, [/"banner":\{"thumbnails":\[\{"url":"([^"]+)"/]) ??
      "";

    // External/social links — best-effort, format varies (headerLinks / primaryLinks)
    const links: { title: string; url: string }[] = [];
    const linkMatches = jsonStr.matchAll(
      /"title":\{"content":"([^"]+)"[^}]*\},"url":\{"content":"(https?:[^"]+)"/g
    );
    for (const m of linkMatches) {
      if (links.length >= 6) break;
      links.push({ title: m[1], url: m[2] });
    }

    return {
      name,
      handle,
      subscribers,
      totalViews,
      videoCount,
      description: description.slice(0, 280),
      joinDate,
      country,
      verified,
      avatar,
      banner,
      links,
    };
  } catch {
    return { ...EMPTY_CHANNEL, error: "Data extract karte waqt error aayi." };
  }
}

function parseCount(text: string): number {
  if (!text) return 0;
  const cleaned = text.replace(/,/g, "").trim().toUpperCase();
  const num = parseFloat(cleaned);
  if (cleaned.includes("K")) return num * 1_000;
  if (cleaned.includes("M")) return num * 1_000_000;
  if (cleaned.includes("B")) return num * 1_000_000_000;
  return isNaN(num) ? 0 : num;
}

function estimateEarnings(
  totalViewsText: string,
  videoCountText: string,
  category: string
) {
  const rpm = CATEGORY_RPM[category] ?? CATEGORY_RPM.Other;
  const totalViews = parseCount(totalViewsText);
  const videoCount = Math.max(parseCount(videoCountText), 1);
  const avgViewsPerVideo = totalViews / videoCount;
  const assumedVideosPerMonth = 4; // andaza — user apni upload frequency se adjust kar sakta hai

  const monthlyViews = avgViewsPerVideo * assumedVideosPerMonth;
  const lowEarning = (monthlyViews / 1000) * rpm.low;
  const highEarning = (monthlyViews / 1000) * rpm.high;

  return {
    avgViewsPerVideo: Math.round(avgViewsPerVideo),
    monthlyViews: Math.round(monthlyViews),
    rpmLow: rpm.low,
    rpmHigh: rpm.high,
    monthlyLow: lowEarning.toFixed(2),
    monthlyHigh: highEarning.toFixed(2),
  };
}

// ---------------------------------------------------------------------------
// Trending Topics — video titles ke words se sabse zyada repeat hone wale
// keywords nikalte hain, taake ek "trending topics right now" list ban sake
// (YouTube khud alag se "topics" API nahi deta, isliye yeh derived hai).
// ---------------------------------------------------------------------------
const STOPWORDS = new Set([
  "the","a","an","and","or","of","to","in","on","for","is","are","with","at","by","from",
  "this","that","it","its","new","vs","ft","feat","official","video","full","part","episode",
  "how","what","why","when","who","your","you","my","we","our","i","2024","2025","2026",
]);

function getTrendingTopics(videos: TrendingVideo[]): string[] {
  const freq = new Map<string, number>();
  for (const v of videos) {
    const words = v.title
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOPWORDS.has(w) && isNaN(Number(w)));
    for (const w of words) {
      freq.set(w, (freq.get(w) ?? 0) + 1);
    }
  }
  return Array.from(freq.entries())
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}


export default async function TrendingPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; channelUrl?: string; niche?: string }>;
}) {
  const sp = await searchParams;
  const category = sp.category ?? "Now";
  const { tabs, videos, error: trendingError } = await getTrendingByCategory(
    category
  );
  const trendingTopics = getTrendingTopics(videos);

  let channelStats: ChannelStats | null = null;
  let earnings: ReturnType<typeof estimateEarnings> | null = null;
  const niche = sp.niche ?? "Other";

  if (sp.channelUrl) {
    channelStats = await getChannelStats(sp.channelUrl);
    if (!channelStats.error) {
      earnings = estimateEarnings(
        channelStats.totalViews,
        channelStats.videoCount,
        niche
      );
    }
  }

  return (
    <main className="ytte-page">
      <style>{`
        .ytte-page { min-height: 100vh; background: #F7F7FB; color: #1E1F2E; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        .ytte-container { max-width: 1024px; margin: 0 auto; padding: 40px 24px; }
        .ytte-header { margin-bottom: 32px; }
        .ytte-badge-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .ytte-emoji { font-size: 30px; line-height: 1; }
        .ytte-tag { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #EDEBFF; color: #6C63FF; padding: 4px 10px; border-radius: 999px; }
        .ytte-title { font-size: 28px; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 8px 0; }
        .ytte-subtitle { font-size: 14px; color: #6B6F82; margin: 0; max-width: 640px; line-height: 1.6; }
        .ytte-accent-text { color: #6C63FF; font-weight: 600; }
        .ytte-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
        .ytte-tab { padding: 7px 16px; border-radius: 999px; font-size: 14px; font-weight: 500; border: 1px solid #E4E3F5; background: #FFFFFF; color: #6B6F82; text-decoration: none; transition: all 0.15s ease; }
        .ytte-tab:hover { border-color: #6C63FF; color: #6C63FF; }
        .ytte-tab-active { background: #6C63FF; border-color: #6C63FF; color: #FFFFFF; }
        .ytte-tab-active:hover { color: #FFFFFF; }
        .ytte-error { margin-bottom: 24px; border-radius: 10px; border: 1px solid #F3D6D6; background: #FDF1F1; padding: 14px 16px; font-size: 14px; color: #B3413F; }
        .ytte-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; margin-bottom: 48px; }
        .ytte-empty { font-size: 14px; color: #6B6F82; }
        .ytte-card { display: block; border-radius: 12px; border: 1px solid #E4E3F5; background: #FFFFFF; overflow: hidden; text-decoration: none; color: inherit; box-shadow: 0 1px 2px rgba(20,20,43,0.04); transition: box-shadow 0.15s ease, border-color 0.15s ease; }
        .ytte-card:hover { box-shadow: 0 4px 16px rgba(108,99,255,0.12); border-color: #6C63FF; }
        .ytte-card:hover .ytte-card-title { color: #6C63FF; }
        .ytte-thumb { width: 100%; height: 160px; object-fit: cover; display: block; background: #EDEBFF; }
        .ytte-card-body { padding: 14px; }
        .ytte-card-title { font-size: 14px; font-weight: 600; line-height: 1.4; margin: 0 0 6px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .ytte-card-channel { font-size: 12px; color: #6B6F82; margin: 0; }
        .ytte-card-meta { font-size: 12px; color: #9A9DB0; margin: 4px 0 0 0; }
        .ytte-panel { border-radius: 16px; border: 1px solid #E4E3F5; background: #FFFFFF; padding: 32px; box-shadow: 0 1px 2px rgba(20,20,43,0.04); }
        .ytte-panel-heading { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
        .ytte-panel-title { font-size: 20px; font-weight: 700; margin: 0; }
        .ytte-panel-sub { font-size: 14px; color: #6B6F82; margin: 0 0 20px 0; }
        .ytte-form { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 8px; }
        .ytte-input, .ytte-select { border-radius: 8px; background: #F7F7FB; border: 1px solid #E4E3F5; padding: 10px 14px; font-size: 14px; color: #1E1F2E; font-family: inherit; }
        .ytte-input { flex: 1; min-width: 220px; }
        .ytte-input:focus, .ytte-select:focus { outline: none; border-color: #6C63FF; box-shadow: 0 0 0 3px #EDEBFF; }
        .ytte-btn { border-radius: 8px; background: #6C63FF; color: #FFFFFF; font-weight: 600; font-size: 14px; padding: 10px 24px; border: none; cursor: pointer; font-family: inherit; transition: background 0.15s ease; }
        .ytte-btn:hover { background: #5750D6; }
        .ytte-result { margin-top: 24px; border-radius: 12px; border: 1px solid #E4E3F5; background: #F7F7FB; padding: 24px; }
        .ytte-result-error { font-size: 14px; color: #B3413F; margin: 0; }
        .ytte-result-name { font-size: 18px; font-weight: 700; margin: 0 0 16px 0; }
        .ytte-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 16px; margin-bottom: 20px; }
        .ytte-divider { border-top: 1px solid #E4E3F5; padding-top: 18px; }
        .ytte-estimate-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600; color: #9A9DB0; margin: 0 0 12px 0; }
        .ytte-stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.03em; font-weight: 500; color: #9A9DB0; margin: 0 0 4px 0; }
        .ytte-stat-value { font-size: 14px; font-weight: 600; color: #1E1F2E; margin: 0; }
        .ytte-stat-highlight { color: #6C63FF; }
        .ytte-footer { margin-top: 40px; font-size: 12px; color: #9A9DB0; text-align: center; }
        .ytte-refresh-note { font-size: 12px; color: #6C63FF; background: #EDEBFF; display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 999px; margin-bottom: 20px; }
        .ytte-topics-wrap { margin-bottom: 24px; }
        .ytte-topics-label { font-size: 13px; font-weight: 600; color: #6B6F82; margin: 0 0 10px 0; }
        .ytte-topics-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .ytte-topic-pill { font-size: 13px; font-weight: 500; background: #FFF7E8; color: #B8860B; border: 1px solid #F3E6C4; padding: 5px 12px; border-radius: 999px; }
        .ytte-profile { display: flex; gap: 18px; align-items: flex-start; margin-bottom: 20px; }
        .ytte-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; background: #EDEBFF; flex-shrink: 0; }
        .ytte-profile-name-row { display: flex; align-items: center; gap: 6px; }
        .ytte-verified { color: #6C63FF; font-size: 13px; }
        .ytte-profile-handle { font-size: 13px; color: #6B6F82; margin: 2px 0 8px 0; }
        .ytte-profile-desc { font-size: 13px; color: #444759; line-height: 1.6; margin: 0 0 10px 0; max-width: 640px; }
        .ytte-profile-meta { font-size: 12px; color: #9A9DB0; display: flex; flex-wrap: wrap; gap: 14px; }
        .ytte-links-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
        .ytte-link-chip { font-size: 12px; color: #6C63FF; background: #EDEBFF; padding: 4px 10px; border-radius: 999px; text-decoration: none; }
      `}</style>

      <script
        dangerouslySetInnerHTML={{
          __html: `setTimeout(() => { window.location.reload(); }, 300000);`,
        }}
      />

      <div className="ytte-container">
        <div className="ytte-refresh-note">🔄 Auto-refreshes every 5 minutes</div>
        <header className="ytte-header">
          <div className="ytte-badge-row">
            <span className="ytte-emoji">📈</span>
            <span className="ytte-tag">New</span>
          </div>
          <h1 className="ytte-title">YouTube Trending &amp; Channel Earnings Estimator</h1>
          <p className="ytte-subtitle">
            Browse trending YouTube videos by category, then check any channel&apos;s
            estimated RPM, CPC and monthly earnings.{" "}
            <span className="ytte-accent-text">Earnings figures are estimates</span> —
            not real AdSense data.
          </p>
        </header>

        <nav className="ytte-tabs">
          {(tabs.length ? tabs.map((t) => t.title) : CATEGORY_NAMES.slice(0, 4)).map(
            (title, idx) => (
              <a
                key={`${title || "tab"}-${idx}`}
                href={`?category=${encodeURIComponent(title)}`}
                className={`ytte-tab ${category === title ? "ytte-tab-active" : ""}`}
              >
                {title}
              </a>
            )
          )}
        </nav>

        {trendingTopics.length > 0 && (
          <div className="ytte-topics-wrap">
            <p className="ytte-topics-label">🔥 Trending Topics Right Now</p>
            <div className="ytte-topics-list">
              {trendingTopics.map((topic) => (
                <span key={topic} className="ytte-topic-pill">
                  #{topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {trendingError && <div className="ytte-error">{trendingError}</div>}

        <section className="ytte-grid">
          {videos.length === 0 && !trendingError && (
            <p className="ytte-empty">No videos found for this category.</p>
          )}
          {videos.slice(0, 24).map((v) => (
            <a
              key={v.videoId}
              href={v.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ytte-card"
            >
              {v.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.thumbnail} alt={v.title} className="ytte-thumb" />
              )}
              <div className="ytte-card-body">
                <h3 className="ytte-card-title">{v.title}</h3>
                <p className="ytte-card-channel">{v.channelName}</p>
                <p className="ytte-card-meta">
                  {v.views} {v.publishedTime && `· ${v.publishedTime}`}
                </p>
              </div>
            </a>
          ))}
        </section>

        <section className="ytte-panel">
          <div className="ytte-panel-heading">
            <span className="ytte-emoji" style={{ fontSize: 20 }}>💰</span>
            <h2 className="ytte-panel-title">Channel Earnings Estimator</h2>
          </div>
          <p className="ytte-panel-sub">
            Paste a channel link and pick its niche — we&apos;ll estimate its RPM/CPC
            range and possible monthly earnings.
          </p>

          <form method="GET" className="ytte-form">
            <input type="hidden" name="category" value={category} />
            <input
              type="text"
              name="channelUrl"
              placeholder="https://www.youtube.com/@channelname"
              defaultValue={sp.channelUrl ?? ""}
              className="ytte-input"
              required
            />
            <select name="niche" defaultValue={niche} className="ytte-select">
              {CATEGORY_NAMES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button type="submit" className="ytte-btn">
              Check Channel
            </button>
          </form>

          {channelStats && (
            <div className="ytte-result">
              {channelStats.error ? (
                <p className="ytte-result-error">{channelStats.error}</p>
              ) : (
                <>
                  <div className="ytte-profile">
                    {channelStats.avatar && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={channelStats.avatar} alt={channelStats.name} className="ytte-avatar" />
                    )}
                    <div>
                      <div className="ytte-profile-name-row">
                        <h3 className="ytte-result-name" style={{ marginBottom: 0 }}>
                          {channelStats.name}
                        </h3>
                        {channelStats.verified && <span className="ytte-verified">✔ Verified</span>}
                      </div>
                      <p className="ytte-profile-handle">{channelStats.handle}</p>
                      {channelStats.description && (
                        <p className="ytte-profile-desc">{channelStats.description}</p>
                      )}
                      <div className="ytte-profile-meta">
                        <span>📅 Joined: {channelStats.joinDate}</span>
                        <span>🌍 Country: {channelStats.country}</span>
                      </div>
                      {channelStats.links.length > 0 && (
                        <div className="ytte-links-row">
                          {channelStats.links.map((l) => (
                            <a
                              key={l.url}
                              href={l.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ytte-link-chip"
                            >
                              {l.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ytte-stats-grid">
                    <Stat label="Subscribers" value={channelStats.subscribers} />
                    <Stat label="Total Views" value={channelStats.totalViews} />
                    <Stat label="Videos" value={channelStats.videoCount} />
                    <Stat label="Niche" value={niche} />
                  </div>

                  {earnings && (
                    <div className="ytte-divider">
                      <p className="ytte-estimate-label">Estimated — not real AdSense data</p>
                      <div className="ytte-stats-grid">
                        <Stat label="Avg Views / Video" value={earnings.avgViewsPerVideo.toLocaleString()} />
                        <Stat label="Estimated RPM" value={`$${earnings.rpmLow} – $${earnings.rpmHigh}`} />
                        <Stat label="Est. Monthly Views" value={earnings.monthlyViews.toLocaleString()} />
                        <Stat
                          label="Est. Monthly Earning"
                          value={`$${earnings.monthlyLow} – $${earnings.monthlyHigh}`}
                          highlight
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </section>

        <footer className="ytte-footer">
          Data is scraped from public YouTube pages (no official API). Results may
          break if YouTube changes its page structure. Earnings/RPM/CPC are
          estimates, not exact figures.
        </footer>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="ytte-stat-label">{label}</p>
      <p className={`ytte-stat-value ${highlight ? "ytte-stat-highlight" : ""}`}>
        {value || "N/A"}
      </p>
    </div>
  );
}