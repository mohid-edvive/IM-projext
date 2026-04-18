import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGameStore } from "@/store/gameStore";
import { chapters } from "@/data/lessons";
import { Lock, CheckCircle2, ChevronRight, icons, Newspaper, ExternalLink } from "lucide-react";
import { fetchMarketNews, timeAgo, type NewsArticle } from "@/lib/newsApi";

const iconNameMap: Record<string, string> = {
  "trending-up": "TrendingUp",
  "dollar-sign": "DollarSign",
  "zap": "Zap",
  "search": "Search",
  "brain": "Brain",
  "circle-dollar-sign": "CircleDollarSign",
  "bitcoin": "Bitcoin",
  "bar-chart-3": "BarChart3",
  "target": "Target",
  "award": "Award",
};

function ChapterIcon({ name }: { name: string }) {
  const LucideIcon = (icons as Record<string, React.ElementType>)[iconNameMap[name] || "BookOpen"];
  if (!LucideIcon) return null;
  return <LucideIcon className="h-3.5 w-3.5 text-muted-foreground" />;
}

const PLACEHOLDER_NEWS: NewsArticle[] = [
  { id: 9001, category: "general", datetime: Math.floor(Date.now() / 1000) - 3600,   headline: "Fed Holds Interest Rates Steady, Signals Caution on Inflation",       image: "", related: "SPY,QQQ",  source: "Investigo", summary: "The Federal Reserve kept its benchmark rate unchanged, citing persistent inflation risks.", url: "#" },
  { id: 9002, category: "general", datetime: Math.floor(Date.now() / 1000) - 7200,   headline: "NVIDIA Surges Past $1 Trillion Market Cap on AI Chip Demand",           image: "", related: "NVDA",     source: "Investigo", summary: "Strong demand for AI training chips pushed NVIDIA to a historic valuation milestone.", url: "#" },
  { id: 9003, category: "general", datetime: Math.floor(Date.now() / 1000) - 14400,  headline: "S&P 500 Hits All-Time High as Tech Stocks Rally",                       image: "", related: "SPY,AAPL", source: "Investigo", summary: "The S&P 500 index reached a new record driven by mega-cap technology stocks.", url: "#" },
  { id: 9004, category: "crypto",  datetime: Math.floor(Date.now() / 1000) - 21600,  headline: "Bitcoin Breaks $70,000 Amid Spot ETF Inflows",                          image: "", related: "BTC-USD",  source: "Investigo", summary: "Institutional demand for Bitcoin spot ETFs continues to drive prices higher.", url: "#" },
  { id: 9005, category: "general", datetime: Math.floor(Date.now() / 1000) - 50000,  headline: "Gold Hits Record $2,400 as Geopolitical Tensions Rise",                 image: "", related: "GC=F",     source: "Investigo", summary: "Safe-haven demand pushes gold to an all-time high.", url: "#" },
];

const FREE_LESSONS = ["1-1", "1-2", "1-3", "1-4", "1-5"];

export default function Learn() {
  const completedLessons = useGameStore((s) => s.completedLessons);
  const totalEarned      = useGameStore((s) => s.totalEarned);
  const [news, setNews]  = useState<NewsArticle[]>(PLACEHOLDER_NEWS);

  useEffect(() => {
    fetchMarketNews("general").then((data) => { if (data.length > 0) setNews(data.slice(0, 5)); });
  }, []);

  const lessonStatus = (lessonId: string, li: number, ci: number) => {
    if (completedLessons.includes(lessonId)) return "completed";
    if (FREE_LESSONS.includes(lessonId)) return "active";
    const chapter = chapters[ci];
    if (li > 0 && completedLessons.includes(chapter.lessons[li - 1].id)) return "active";
    if (li === 0 && ci > 0) {
      const prev = chapters[ci - 1];
      if (completedLessons.includes(prev.lessons[prev.lessons.length - 1].id)) return "active";
    }
    return "locked";
  };

  const progressPct = (completedLessons.length / 50) * 100;

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="container mx-auto max-w-5xl px-5 md:px-8 py-8">

        {/* ── page header ── */}
        <div className="border-b border-border pb-8 mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Learning path · {completedLessons.length} / 50 complete
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-serif italic text-[clamp(2rem,5vw,3.5rem)] leading-tight text-foreground">
              Your curriculum
            </h1>
            <span className="font-mono text-[11px] text-[hsl(var(--amber))] shrink-0 mb-1">
              ${totalEarned.toLocaleString()} earned
            </span>
          </div>

          {/* overall progress */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Overall progress</p>
              <p className="font-mono text-[9px] text-muted-foreground">{progressPct.toFixed(0)}%</p>
            </div>
            <div className="w-full bg-border h-px relative">
              <div className="absolute top-0 left-0 h-px bg-foreground transition-all duration-500"
                style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_260px] gap-8">

          {/* ── chapters list ── */}
          <div className="space-y-8">
            {chapters.map((chapter, ci) => {
              const done    = chapter.lessons.filter((l) => completedLessons.includes(l.id)).length;
              const pct     = (done / chapter.lessons.length) * 100;
              const allDone = done === chapter.lessons.length;

              return (
                <div key={chapter.id}>
                  {/* chapter header */}
                  <div className="border border-border p-4 mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-[11px] tracking-widest shrink-0 ${allDone ? "text-gain" : "text-[hsl(var(--amber))]"}`}>
                        {String(chapter.id).padStart(2, "0")}
                      </span>
                      <ChapterIcon name={chapter.icon} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="font-serif italic text-base text-foreground">{chapter.name}</h2>
                          {allDone && <CheckCircle2 className="h-3.5 w-3.5 text-gain shrink-0" />}
                        </div>
                        <p className="font-mono text-[9px] text-muted-foreground mt-0.5">
                          {done}/{chapter.lessons.length} · ${chapter.baseReward}/lesson
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-border h-px relative">
                      <div className="absolute top-0 left-0 h-px bg-foreground transition-all duration-500"
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  {/* lesson grid */}
                  <div className="grid grid-cols-5 gap-px bg-border border border-border">
                    {chapter.lessons.map((lesson, li) => {
                      const status      = lessonStatus(lesson.id, li, ci);
                      const isLocked    = status === "locked";
                      const isCompleted = status === "completed";
                      const isActive    = status === "active";

                      return (
                        <Link
                          key={lesson.id}
                          to={isLocked ? "#" : `/lesson/${lesson.id}`}
                          onClick={(e) => isLocked && e.preventDefault()}
                          className={`bg-background p-3 flex flex-col gap-1.5 transition-colors ${
                            isLocked    ? "opacity-30 cursor-not-allowed" :
                            isCompleted ? "hover:bg-muted/30" :
                            isActive    ? "hover:bg-muted/40 cursor-pointer" :
                            "hover:bg-muted/30 cursor-pointer"
                          }`}
                        >
                          {/* lesson number + status icon */}
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
                              L{lesson.lessonNumber}
                            </span>
                            {isCompleted && <CheckCircle2 className="h-2.5 w-2.5 text-gain" />}
                            {isLocked    && <Lock className="h-2.5 w-2.5 text-muted-foreground" />}
                            {isActive    && <div className="h-1.5 w-1.5 bg-[hsl(var(--amber))]" />}
                          </div>

                          {/* title */}
                          <p className="text-[11px] font-medium text-foreground leading-tight">
                            {lesson.title}
                          </p>

                          {/* reward + arrow */}
                          <div className="flex items-center justify-between mt-auto pt-0.5">
                            <span className="font-mono text-[9px] text-[hsl(var(--amber))]">
                              ${lesson.baseReward}
                            </span>
                            {isActive && <ChevronRight className="h-2.5 w-2.5 text-foreground" />}
                          </div>

                          {/* unlock tags */}
                          {lesson.assetToUnlock.length > 0 && (
                            <div className="flex flex-wrap gap-0.5 mt-0.5">
                              {lesson.assetToUnlock.slice(0, 2).map((a) => (
                                <span key={a}
                                  className="border border-border px-1 text-[7px] font-mono text-muted-foreground">
                                  {a}
                                </span>
                              ))}
                              {lesson.assetToUnlock.length > 2 && (
                                <span className="font-mono text-[7px] text-muted-foreground">
                                  +{lesson.assetToUnlock.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── news sidebar ── */}
          <div className="hidden md:block">
            <div className="sticky top-16">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Market news
              </p>
              <div className="border border-border divide-y divide-border">
                {news.map((article, i) => (
                  <a key={`${article.id}-${i}`} href={article.url}
                    target="_blank" rel="noopener noreferrer"
                    className="block px-4 py-3 hover:bg-muted/30 transition-colors group">
                    <p className="text-[11px] font-medium text-foreground leading-snug line-clamp-2 group-hover:underline">
                      {article.headline}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="font-mono text-[9px] text-muted-foreground">{article.source}</span>
                      <span className="font-mono text-[9px] text-muted-foreground">{timeAgo(article.datetime)}</span>
                      <ExternalLink className="h-2.5 w-2.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100" />
                    </div>
                  </a>
                ))}
              </div>
              <div className="mt-3 border border-border p-4 text-center">
                <Newspaper className="h-4 w-4 text-muted-foreground mx-auto mb-2" />
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                  Live headlines update<br />every 15 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
