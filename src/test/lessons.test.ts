import { describe, it, expect } from "vitest";
import { chapters, allLessons, getLessonById } from "@/data/lessons";

describe("lessons data", () => {
  it("has 10 chapters", () => {
    expect(chapters.length).toBe(10);
  });

  it("has 50 total lessons", () => {
    expect(allLessons.length).toBe(50);
  });

  it("each lesson has required fields", () => {
    allLessons.forEach((lesson) => {
      expect(lesson.id).toBeTruthy();
      expect(lesson.title).toBeTruthy();
      expect(lesson.content.length).toBeGreaterThan(50);
      expect(lesson.quiz.length).toBe(6);
      expect(lesson.baseReward).toBeGreaterThan(0);
    });
  });

  it("each quiz question has 4 options", () => {
    allLessons.forEach((lesson) => {
      lesson.quiz.forEach((q) => {
        expect(q.options.length).toBe(4);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(4);
        expect(q.weight).toBeGreaterThan(0);
      });
    });
  });

  it("getLessonById returns correct lesson", () => {
    const lesson = getLessonById("1-1");
    expect(lesson).toBeTruthy();
    expect(lesson?.id).toBe("1-1");
  });

  it("getLessonById returns undefined for invalid id", () => {
    expect(getLessonById("invalid")).toBeUndefined();
  });
});
