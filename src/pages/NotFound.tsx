import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error("404 — route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center border border-border p-12 max-w-sm">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Error 404
        </p>
        <div className="number-display text-6xl font-bold text-foreground mb-2">404</div>
        <h1 className="font-serif italic text-2xl text-foreground mb-3">Page not found.</h1>
        <p className="font-mono text-[10px] text-muted-foreground mb-6">
          <span className="text-foreground">{location.pathname}</span> doesn't exist.
        </p>
        <Button asChild size="sm"
          className="bg-foreground text-background hover:bg-foreground/90 text-[11px] rounded-sm px-6">
          <Link to="/"><ArrowLeft className="h-3 w-3 mr-1.5" /> Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
