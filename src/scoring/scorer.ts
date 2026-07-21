import type ListingData from "../content/listingData";
import type { RuleResult, ScoreResult } from "./types";

interface CategoryConfig {
  name: string;
  weight: number; // 0.35, 0.30, 0.20, 0.15
  rules: Array<(data: ListingData) => RuleResult>;
}

const CATEGORIES: CategoryConfig[] = [
  { name: 'Titre', weight: 0.35, rules: [] },
  { name: 'Photos', weight: 0.30, rules: [] },
  { name: 'Complétude', weight: 0.20, rules: [] },
  { name: 'Description', weight: 0.15, rules: [] },
];

interface Grade {
  name: 'A' | 'B' | 'C' | 'D' | 'F';
  minScore: number;
  maxScore: number;
}

const GRADES: Grade[] = [
  { name: 'A', minScore: 90, maxScore: 101 },
  { name: 'B', minScore: 75, maxScore: 90 },
  { name: 'C', minScore: 60, maxScore: 75 },
  { name: 'D', minScore: 40, maxScore: 60 },
  { name: 'F', minScore: 0, maxScore: 40 },
];

function calculateScore(data: ListingData): ScoreResult {
  return {
    globalScore: 0,
    grade: 'A',
    categories: [],
  };
}

function scoreToGrade(score: number): Grade {
  if (score < 0 || score > 100) {
    console.warn(`scoreToGrade: score hors bornes attendues (${score})`);
    score = Math.max(0, Math.min(100, score));
  }

  // TODO : mettre rounded dans calculateScore pour éviter de recalculer à chaque fois
  const rounded = Math.round(score);

  return GRADES.find(grade => rounded >= grade.minScore && rounded < grade.maxScore) || GRADES[GRADES.length - 1];
}

export default calculateScore;