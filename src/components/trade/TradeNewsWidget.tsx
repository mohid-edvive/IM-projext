import { useState, useEffect } from "react";
import { fetchCompanyNews, fetchMarketSentiment, timeAgo, type NewsArticle } from "@/lib/newsApi";
import { getAssetById } from "@/data/assets";
import { Newspaper, ExternalLink, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TradeNewsWidgetProps {
  assetId: string;
}

export default function TradeNewsWidget({ assetId }: TradeNewsWidgetProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [sentiment, setSentiment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const asset = getAssetById(assetId);

  const isStock = asset?.category === "stocks";
  const ticker = asset?.ticker || assetId;

  useEffect(() => {
    if (!isStock) {
      setArticles([]);
      setSentiment(null);
      return;
    }
    loadData();
  }, [assetId, isStock]);

  async function loadData() {
    setLoading(true);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const from = weekAgo.toISOString().split("T")[0];
    const to = today.toISOString().split("T")[0];

    const [newsData, sentData] = await Promise.all([
      fetchCompanyNews(ticker, from, to),
      fetchMarketSentiment(ticker),
    ]);
    setArticles(newsData.slice(0, 5));
    setSentiment(sentData);
    setLoading(false);
  }

  if (!isStock) return null;

  const bullish = sentiment?.sentiment?.bullishPercent;
  const bearish = sentiment?.sentiment?.bearishPercent;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-1.5">
          <Newspaper className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            {ticker} News
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={loadData} className="h-5 w-5">
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {sentiment?.sentiment && bullish != null && (
        <div className="px-3 py-2 border-b border-border/50 flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px]">
            <TrendingUp className="h-3 w-3 text-gain" />
            <span className="number-display text-gain font-medium">{(bullish * 100).toFixed(0)}%</span>
          </div>
          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-gain rounded-full" style={{ width: `${bullish * 100}%` }} />
          </div>
          <div className="flex items-center gap-1 text-[10px]">
            <span className="number-display text-loss font-medium">{(bearish * 100).toFixed(0)}%</span>
            <TrendingDown className="h-3 w-3 text-loss" />
          </div>
        </div>
      )}

      <div className="max-h-[220px] overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-xs text-muted-foreground">Loading news...</div>
        ) : articles.length === 0 ? (
          <div className="p-4 text-center text-xs text-muted-foreground">No recent news for {ticker}</div>
        ) : (
          articles.map((article, i) => (
            <a
              key={`${article.id}-${i}`}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2.5 border-b border-border/50 hover:bg-muted/30 transition-colors group"
            >
              <div className="text-[11px] font-medium text-foreground leading-snug line-clamp-2 group-hover:underline">
                {article.headline}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] text-muted-foreground">{article.source}</span>
                <span className="text-[9px] number-display text-muted-foreground">{timeAgo(article.datetime)}</span>
                <ExternalLink className="h-2.5 w-2.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100" />
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
