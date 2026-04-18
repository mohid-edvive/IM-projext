import { useState, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { getLessonById, allLessons } from "@/data/lessons";
import { getInteractivesForLesson } from "@/data/interactives";
import InteractiveBlockRenderer from "@/components/lesson/InteractiveBlock";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw, ChevronRight,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function Lesson() {
  const { id } = useParams<{ id: string }>();
  const lesson  = getLessonById(id || "");

  const completeLesson   = useGameStore((s) => s.completeLesson);
  const completedLessons = useGameStore((s) => s.completedLessons);

  const [phase,          setPhase]          = useState<"reading" | "quiz" | "results">("reading");
  const [answers,        setAnswers]        = useState<Record<string, number>>({});
  const [submitted,      setSubmitted]      = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [quizProgress,   setQuizProgress]   = useState(0);

  const alreadyCompleted = lesson ? completedLessons.includes(lesson.id) : false;
  const maxWeighted      = lesson ? lesson.quiz.reduce((s, q) => s + q.weight, 0) : 0;
  const interactives     = lesson ? getInteractivesForLesson(lesson.id) : [];
  const paragraphs       = lesson ? lesson.content.split("\n\n") : [];

  const sections = useMemo(() => {
    if (!lesson) return [];
    const secs: { paragraphs: string[]; blocks: typeof interactives }[] = [];
    for (let i = 0; i < paragraphs.length; i += 2) {
      const ps = paragraphs.slice(i, i + 2);
      const bs = interactives.filter((b) => b.afterParagraph >= i && b.afterParagraph < i + 2);
      secs.push({ paragraphs: ps, blocks: bs });
    }
    if (secs.length > 0) {
      const remaining = interactives.filter((b) => b.afterParagraph >= paragraphs.length - 1);
      remaining.forEach((rb) => { if (!secs[secs.length - 1].blocks.includes(rb)) secs[secs.length - 1].blocks.push(rb); });
    }
    return secs;
  }, [lesson, paragraphs, interactives]);

  const totalSections = sections.length;
  const isLastSection = currentSection >= totalSections - 1;

  if (!lesson) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center border border-border p-10 max-w-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">Error</p>
          <h2 className="font-serif italic text-xl text-foreground mb-4">Lesson not found</h2>
          <Button asChild size="sm" className="bg-foreground text-background rounded-sm text-xs">
            <Link to="/learn">Back to Learn</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAnswer = (qId: string, oi: number) => {
    if (submitted) return;
    const next = { ...answers, [qId]: oi };
    setAnswers(next);
    setQuizProgress(Object.keys(next).length);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const weighted = lesson.quiz.reduce((s, q) => answers[q.id] === q.correctIndex ? s + q.weight : s, 0);
    const pct = (weighted / maxWeighted) * 100;
    if (pct >= 80 && !alreadyCompleted) {
      const reward = Math.round((pct / 100) * lesson.baseReward);
      completeLesson(lesson.id, reward, lesson.assetToUnlock, pct);
      setTimeout(() => confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 }, colors: ["#12261f", "#c8852c", "#f5f2ea"] }), 300);
    }
    setPhase("results");
  };

  const weightedScore   = lesson.quiz.reduce((s, q) => answers[q.id] === q.correctIndex ? s + q.weight : s, 0);
  const percentageScore = (weightedScore / maxWeighted) * 100;
  const passed          = percentageScore >= 80;
  const reward          = Math.round((percentageScore / 100) * lesson.baseReward);
  const answeredAll     = lesson.quiz.every((q) => answers[q.id] !== undefined);
  const currentIdx      = allLessons.findIndex((l) => l.id === lesson.id);
  const nextLesson      = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  const resetQuiz   = () => { setAnswers({}); setSubmitted(false); setQuizProgress(0); setPhase("quiz"); };
  const goToSection = (idx: number) => { setCurrentSection(Math.max(0, Math.min(totalSections - 1, idx))); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const PHASES = ["Reading", "Quiz", "Results"] as const;
  const phaseIdx = { reading: 0, quiz: 1, results: 2 }[phase];

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="container mx-auto max-w-2xl px-5 md:px-8 py-8">

        {/* breadcrumb */}
        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
          <Link to="/learn" className="hover:text-foreground transition-colors">Learn</Link>
          <ChevronRight className="h-2.5 w-2.5" />
          <span>Ch. {lesson.chapterId}</span>
          <ChevronRight className="h-2.5 w-2.5" />
          <span className="text-foreground">L{lesson.lessonNumber}</span>
        </div>

        {/* lesson title */}
        <div className="border-b border-border pb-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-serif italic text-2xl text-foreground">{lesson.title}</h1>
            {alreadyCompleted && <CheckCircle2 className="h-4 w-4 text-gain shrink-0" />}
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
            ~5 min · up to ${lesson.baseReward}
            {lesson.assetToUnlock.length > 0 && ` · unlocks ${lesson.assetToUnlock.join(", ")}`}
          </p>
        </div>

        {/* phase bar */}
        <div className="grid grid-cols-3 gap-px bg-border border border-border mb-6">
          {PHASES.map((label, i) => (
            <div key={label} className={`text-center py-2 font-mono text-[9px] uppercase tracking-[0.15em] ${
              i === phaseIdx ? "bg-foreground text-background" :
              i < phaseIdx  ? "bg-muted text-foreground" :
              "bg-background text-muted-foreground"
            }`}>
              {label}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── READING ── */}
          {phase === "reading" && (
            <motion.div key="reading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* section progress dots */}
              <div className="flex items-center gap-0.5 mb-4">
                {sections.map((_, i) => (
                  <button key={i} onClick={() => goToSection(i)}
                    className={`flex-1 h-px transition-colors ${i <= currentSection ? "bg-foreground" : "bg-border"}`} />
                ))}
              </div>

              <div className="border border-border p-6 mb-4">
                <AnimatePresence mode="wait">
                  <motion.div key={currentSection} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {sections[currentSection]?.paragraphs.map((para, i) => (
                      <p key={i} className="mb-4 text-sm text-foreground leading-relaxed last:mb-0">
                        {para.split("**").map((seg, j) =>
                          j % 2 === 1
                            ? <strong key={j} className="font-semibold text-foreground">{seg}</strong>
                            : <span key={j}>{seg}</span>
                        )}
                      </p>
                    ))}
                    {sections[currentSection]?.blocks.map((block, i) => (
                      <InteractiveBlockRenderer key={`${block.type}-${i}`} block={block} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => goToSection(currentSection - 1)}
                  disabled={currentSection === 0} className="text-[11px] rounded-sm">
                  <ArrowLeft className="h-3 w-3 mr-1" /> Prev
                </Button>
                <span className="font-mono text-[9px] text-muted-foreground">{currentSection + 1}/{totalSections}</span>
                {isLastSection ? (
                  <Button size="sm" onClick={() => setPhase("quiz")}
                    className="text-[11px] bg-foreground text-background rounded-sm">
                    Start Quiz <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => goToSection(currentSection + 1)}
                    className="text-[11px] rounded-sm">
                    Next <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>

              {isLastSection && (
                <div className="mt-5 border border-border p-5 text-center">
                  <p className="font-serif italic text-base text-foreground mb-1">
                    Ready to earn up to{" "}
                    <span className="number-display not-italic font-semibold text-[hsl(var(--amber))]">${lesson.baseReward}</span>?
                  </p>
                  <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.15em] mb-3">
                    Score 80 %+ to pass
                  </p>
                  <Button onClick={() => setPhase("quiz")}
                    className="bg-foreground text-background text-[11px] rounded-sm" size="sm">
                    {alreadyCompleted ? "Retake Quiz" : "Start Quiz"} <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* ── QUIZ ── */}
          {phase === "quiz" && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                    {quizProgress} of {lesson.quiz.length} answered
                  </p>
                  <span className="font-mono text-[9px] text-muted-foreground">
                    {Math.round((quizProgress / lesson.quiz.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-border h-px relative">
                  <div className="absolute top-0 left-0 h-px bg-foreground transition-all duration-300"
                    style={{ width: `${(quizProgress / lesson.quiz.length) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-3">
                {lesson.quiz.map((q, qi) => (
                  <div key={q.id} className="border border-border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[hsl(var(--amber))]">
                        Q{qi + 1}
                      </span>
                      <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground border border-border px-1.5 py-0.5">
                        {q.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-foreground font-medium mb-3 leading-snug">{q.question}</p>
                    <div className="space-y-1.5">
                      {q.options.map((opt, oi) => {
                        const isSelected = answers[q.id] === oi;
                        return (
                          <button key={oi} onClick={() => handleAnswer(q.id, oi)}
                            className={`w-full text-left border p-2.5 text-[11px] transition-colors ${
                              isSelected
                                ? "border-foreground bg-muted text-foreground"
                                : "border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground"
                            }`}>
                            <span className="font-mono font-medium mr-2 text-muted-foreground">
                              {String.fromCharCode(65 + oi)}.
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-5">
                <Button variant="ghost" size="sm" onClick={() => { setPhase("reading"); setCurrentSection(totalSections - 1); }} className="text-[11px] rounded-sm">
                  <ArrowLeft className="h-3 w-3 mr-1" /> Back
                </Button>
                <Button onClick={handleSubmit} disabled={!answeredAll} size="sm"
                  className="text-[11px] bg-foreground text-background rounded-sm">
                  Submit <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── RESULTS ── */}
          {phase === "results" && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              {/* score card */}
              <div className={`border p-8 text-center mb-5 ${passed ? "border-gain/30" : "border-destructive/30"}`}>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  {passed ? (alreadyCompleted ? "Review complete" : "Passed") : "Not quite"}
                </p>
                <div className={`number-display text-5xl font-bold mb-2 ${passed ? "text-foreground" : "text-destructive"}`}>
                  {Math.round(percentageScore)}%
                </div>
                <p className="font-mono text-[9px] text-muted-foreground mb-4">
                  {weightedScore} / {maxWeighted} points
                </p>

                {passed && !alreadyCompleted && (
                  <div className="inline-flex flex-col items-center gap-1">
                    <span className="number-display text-2xl font-bold text-[hsl(var(--amber))]">+${reward}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">earned</span>
                  </div>
                )}

                {lesson.assetToUnlock.length > 0 && !alreadyCompleted && passed && (
                  <div className="mt-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-2">Unlocked</p>
                    <div className="flex justify-center gap-1.5 flex-wrap">
                      {lesson.assetToUnlock.map((a) => (
                        <span key={a} className="border border-border px-2 py-0.5 font-mono text-[10px] text-foreground">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* breakdown */}
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-3">Breakdown</p>
              <div className="space-y-2 mb-6">
                {lesson.quiz.map((q, qi) => {
                  const correct = answers[q.id] === q.correctIndex;
                  return (
                    <div key={q.id} className={`border p-3 ${correct ? "border-gain/30" : "border-destructive/20"}`}>
                      <div className="flex items-start gap-2.5">
                        {correct
                          ? <CheckCircle2 className="h-3.5 w-3.5 text-gain shrink-0 mt-0.5" />
                          : <XCircle    className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-foreground font-medium leading-snug">
                            Q{qi + 1}: {q.question}
                          </p>
                          {!correct && (
                            <p className="text-[10px] text-muted-foreground mt-1">
                              <CheckCircle2 className="inline h-2.5 w-2.5 text-gain mr-1" />
                              {q.options[q.correctIndex]}
                            </p>
                          )}
                        </div>
                        <span className={`font-mono text-[10px] font-medium shrink-0 ${correct ? "text-gain" : "text-destructive"}`}>
                          {correct ? `+${q.weight}` : "0"}/{q.weight}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* actions */}
              <div className="flex flex-wrap gap-2 justify-center">
                {!passed && (
                  <Button onClick={resetQuiz} variant="outline" size="sm" className="text-[11px] rounded-sm">
                    <RotateCcw className="h-3 w-3 mr-1" /> Retake
                  </Button>
                )}
                {passed && (
                  <>
                    <Button asChild variant="outline" size="sm" className="text-[11px] rounded-sm">
                      <Link to="/trade">Trade</Link>
                    </Button>
                    {nextLesson && (
                      <Button asChild size="sm" className="text-[11px] bg-foreground text-background rounded-sm">
                        <Link to={`/lesson/${nextLesson.id}`}
                          onClick={() => { setPhase("reading"); setCurrentSection(0); setAnswers({}); setSubmitted(false); setQuizProgress(0); }}>
                          Next Lesson <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    )}
                  </>
                )}
                <Button asChild variant="ghost" size="sm" className="text-[11px]">
                  <Link to="/learn">All lessons</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
