import { useState } from "react";
import { motion } from "framer-motion";
import { generatePriceHistory } from "@/data/priceData";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { InteractiveBlock } from "@/data/interactives";
import {
  Lightbulb, CheckCircle2, XCircle, ArrowRight, Sparkles, Info,
  Calculator, HelpCircle, BarChart3, Shuffle, icons,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const kebabToPascal: Record<string, string> = {
  "lightbulb": "Lightbulb", "landmark": "Landmark", "bar-chart": "BarChart3",
  "trophy": "Trophy", "flame": "Flame", "shopping-cart": "ShoppingCart",
  "calendar": "Calendar", "alert-triangle": "AlertTriangle", "trending-down": "TrendingDown",
  "egg": "Egg", "scan": "Scan", "trending-up": "TrendingUp", "refresh-cw": "RefreshCw",
  "alert-circle": "AlertCircle", "line-chart": "LineChart", "brain": "Brain",
  "rocket": "Rocket", "search": "Search", "flask": "FlaskConical",
};

function BlockIcon({ name }: { name?: string }) {
  if (!name) return <Info className="h-4 w-4 text-muted-foreground shrink-0" />;
  const pascal = kebabToPascal[name];
  const LucideIcon = pascal ? (icons as any)[pascal] : null;
  if (!LucideIcon) return <Info className="h-4 w-4 text-muted-foreground shrink-0" />;
  return <LucideIcon className="h-4 w-4 text-muted-foreground shrink-0" />;
}

function CalloutBlock({ data }: { data: Record<string, any> }) {
  return (
    <div className="border border-border p-3 flex gap-3">
      <BlockIcon name={data.icon} />
      <div>
        <h4 className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-0.5">{data.title}</h4>
        <p className="text-[12px] text-foreground leading-relaxed">{data.text}</p>
      </div>
    </div>
  );
}

function FactBlock({ data }: { data: Record<string, any> }) {
  return (
    <div className="border border-border bg-muted/30 p-3 flex gap-3">
      <BlockIcon name={data.icon} />
      <div>
        <h4 className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest mb-0.5">Did You Know?</h4>
        <p className="text-[12px] text-foreground leading-relaxed">{data.text}</p>
      </div>
    </div>
  );
}

function CalculatorBlock({ data }: { data: Record<string, any> }) {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    data.inputs.forEach((inp: any) => { init[inp.key] = inp.default; });
    return init;
  });
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    try {
      const fn = new Function(...Object.keys(values), `return ${data.formula}`);
      const res = fn(...Object.values(values));
      setResult(Math.round(res * 100) / 100);
    } catch { setResult(0); }
  };

  return (
    <div className="border border-border p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Calculator className="h-3.5 w-3.5 text-muted-foreground" />
        <h4 className="text-[11px] font-semibold text-foreground">{data.title}</h4>
      </div>
      <p className="text-[10px] text-muted-foreground mb-2">{data.description}</p>
      <div className="grid grid-cols-2 gap-2 mb-2">
        {data.inputs.map((inp: any) => (
          <div key={inp.key}>
            <label className="text-[9px] text-muted-foreground block mb-0.5 uppercase tracking-wider">{inp.label}</label>
            <input
              type="number"
              value={values[inp.key]}
              onChange={(e) => setValues((v) => ({ ...v, [inp.key]: parseFloat(e.target.value) || 0 }))}
              className="w-full border border-border bg-background px-2 py-1 text-[11px] number-display text-foreground"
              style={{ borderRadius: "2px" }}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={calculate} className="text-[10px] h-6 bg-foreground text-background" style={{ borderRadius: "2px" }}>
          Calculate
        </Button>
        {result !== null && (
          <span className="text-[11px] font-semibold text-foreground number-display">
            {data.resultLabel}: {data.resultPrefix || ""}{result.toLocaleString()}{data.resultSuffix || ""}
          </span>
        )}
      </div>
    </div>
  );
}

function ScenarioBlock({ data }: { data: Record<string, any> }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="border border-border p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
        <h4 className="text-[11px] font-semibold text-foreground">{data.title}</h4>
      </div>
      <div className="bg-muted/30 border border-border p-2.5 mb-2">
        <p className="text-[11px] text-foreground leading-relaxed">{data.situation}</p>
      </div>
      <p className="text-[11px] font-medium text-foreground mb-1.5">{data.question}</p>
      <div className="space-y-1 mb-2">
        {data.options.map((opt: any, i: number) => {
          const isCorrect = opt.correct;
          const isSelected = selected === i;
          let style = "border-border hover:border-foreground/30";
          if (revealed && isSelected && isCorrect) style = "border-gain bg-gain/3";
          else if (revealed && isSelected && !isCorrect) style = "border-loss bg-loss/3";
          else if (revealed && isCorrect) style = "border-gain/40";

          return (
            <button
              key={i}
              onClick={() => !revealed && setSelected(i)}
              className={`w-full text-left border p-2 text-[11px] transition-colors ${style} ${isSelected && !revealed ? "border-foreground bg-muted/30" : ""}`}
            >
              <div className="flex items-center gap-1.5">
                {revealed && isCorrect && <CheckCircle2 className="h-3 w-3 text-gain shrink-0" />}
                {revealed && isSelected && !isCorrect && <XCircle className="h-3 w-3 text-loss shrink-0" />}
                <span className="text-foreground">{opt.text}</span>
              </div>
            </button>
          );
        })}
      </div>
      {selected !== null && !revealed && (
        <Button size="sm" onClick={() => setRevealed(true)} className="text-[10px] h-6 bg-foreground text-background" style={{ borderRadius: "2px" }}>
          Check Answer
        </Button>
      )}
      {revealed && (
        <div className="border border-border bg-muted/20 p-2.5 mt-1.5">
          <div className="flex items-start gap-1.5">
            <Lightbulb className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[11px] text-foreground leading-relaxed">{data.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function MatchingBlock({ data }: { data: Record<string, any> }) {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const pairs = data.pairs as { term: string; definition: string }[];
  const shuffledDefs = [...pairs].sort(() => 0.5 - Math.random()).map((p) => p.definition);

  const handleMatch = (term: string, def: string) => { if (checked) return; setMatches((m) => ({ ...m, [term]: def })); };
  const allMatched = Object.keys(matches).length === pairs.length;
  const correct = pairs.filter((p) => matches[p.term] === p.definition).length;

  return (
    <div className="border border-border p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Shuffle className="h-3.5 w-3.5 text-muted-foreground" />
        <h4 className="text-[11px] font-semibold text-foreground">{data.title}</h4>
      </div>
      <div className="space-y-1.5">
        {pairs.map((pair) => (
          <div key={pair.term} className="flex items-center gap-2">
            <div className={`border px-2 py-1 text-[10px] font-medium min-w-[90px] ${
              checked && matches[pair.term] === pair.definition ? "border-gain text-gain" :
              checked && matches[pair.term] && matches[pair.term] !== pair.definition ? "border-loss text-loss" :
              "border-border text-foreground"
            }`}>{pair.term}</div>
            <ArrowRight className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
            <select
              value={matches[pair.term] || ""}
              onChange={(e) => handleMatch(pair.term, e.target.value)}
              disabled={checked}
              className="flex-1 border border-border bg-background px-2 py-1 text-[10px] text-foreground"
              style={{ borderRadius: "2px" }}
            >
              <option value="">Select...</option>
              {shuffledDefs.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        {allMatched && !checked && (
          <Button size="sm" onClick={() => setChecked(true)} className="text-[10px] h-6 bg-foreground text-background" style={{ borderRadius: "2px" }}>Check</Button>
        )}
        {checked && (
          <span className={`text-[11px] font-medium ${correct === pairs.length ? "text-gain" : "text-foreground"}`}>
            {correct}/{pairs.length} correct {correct === pairs.length && <CheckCircle2 className="inline h-3 w-3 text-gain" />}
          </span>
        )}
      </div>
    </div>
  );
}

function SliderChallengeBlock({ data }: { data: Record<string, any> }) {
  const [value, setValue] = useState(data.min);
  const [checked, setChecked] = useState(false);
  const isCorrect = Math.abs(value - data.correctValue) <= data.tolerance;

  return (
    <div className="border border-border p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
        <h4 className="text-[11px] font-semibold text-foreground">{data.title}</h4>
      </div>
      <p className="text-[10px] text-muted-foreground mb-2">{data.description}</p>
      <div className="flex items-center gap-3 mb-2">
        <Slider value={[value]} min={data.min} max={data.max} step={data.step} onValueChange={([v]) => !checked && setValue(v)} className="flex-1" />
        <span className="number-display text-[11px] font-semibold text-foreground min-w-[45px] text-right">{data.unit}{value.toFixed(1)}</span>
      </div>
      <div className="flex items-center gap-2">
        {!checked && <Button size="sm" onClick={() => setChecked(true)} className="text-[10px] h-6 bg-foreground text-background" style={{ borderRadius: "2px" }}>Check</Button>}
        {checked && (
          <span className={`text-[11px] font-medium ${isCorrect ? "text-gain" : "text-foreground"}`}>
            {isCorrect ? <><CheckCircle2 className="inline h-3 w-3 text-gain mr-0.5" /> Correct</> : `Answer: ${data.unit}${data.correctValue}`}
          </span>
        )}
      </div>
    </div>
  );
}

function ChartExampleBlock({ data }: { data: Record<string, any> }) {
  const history = generatePriceHistory(data.assetId);
  return (
    <div className="border border-border p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
        <h4 className="text-[11px] font-semibold text-foreground">{data.title}</h4>
      </div>
      <div className="h-32 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="exGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(156, 35%, 11%)" stopOpacity={0.06} />
                <stop offset="95%" stopColor="hsl(156, 35%, 11%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: "hsl(47, 7%, 51%)", fontSize: 8, fontFamily: "Geist Mono, monospace" }} tickLine={false} axisLine={{ stroke: "hsl(156, 20%, 80%)" }} interval={15} />
            <YAxis tick={{ fill: "hsl(47, 7%, 51%)", fontSize: 8, fontFamily: "Geist Mono, monospace" }} tickLine={false} axisLine={{ stroke: "hsl(156, 20%, 80%)" }} domain={["auto", "auto"]} width={40} />
            <Area type="monotone" dataKey="price" stroke="hsl(156, 35%, 11%)" strokeWidth={1} fill="url(#exGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-muted/30 border border-border p-2">
        <div className="flex items-start gap-1.5">
          <Info className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[10px] text-foreground leading-relaxed">{data.annotation}</p>
        </div>
      </div>
    </div>
  );
}

function KeyTakeawayBlock({ data }: { data: Record<string, any> }) {
  return (
    <div className="border border-gain/30 p-3">
      <h4 className="text-[8px] font-medium text-gain uppercase tracking-widest mb-1.5 flex items-center gap-1">
        <CheckCircle2 className="h-3 w-3" /> Key Takeaways
      </h4>
      <ul className="space-y-1">
        {data.points.map((point: string, i: number) => (
          <li key={i} className="flex items-start gap-1.5 text-[11px] text-foreground">
            <span className="text-gain font-bold mt-px">—</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function InteractiveBlockRenderer({ block }: { block: InteractiveBlock }) {
  const renderers: Record<string, (data: Record<string, any>) => JSX.Element> = {
    callout: (d) => <CalloutBlock data={d} />,
    fact: (d) => <FactBlock data={d} />,
    calculator: (d) => <CalculatorBlock data={d} />,
    scenario: (d) => <ScenarioBlock data={d} />,
    matching: (d) => <MatchingBlock data={d} />,
    slider_challenge: (d) => <SliderChallengeBlock data={d} />,
    chart_example: (d) => <ChartExampleBlock data={d} />,
    key_takeaway: (d) => <KeyTakeawayBlock data={d} />,
  };

  const renderer = renderers[block.type];
  if (!renderer) return null;

  return <div className="my-3">{renderer(block.data)}</div>;
}
