import type ListingData from "../content/listingData";
import { calculatePriceScore, calculateShippingScore } from "./rules/completeness";
import { calculateDescLengthScore, calculateDescStructureScore, calculateTitleCoherenceScore } from "./rules/description";
import { calculateVideoScore, calculatePhotoCountScore } from "./rules/photos";
import { calculateDuplicateWordScore, calculateFrontLoadingScore, calculateSeparatorScore, calculateLengthScore } from "./rules/title";
import type { CategoryResult, RuleResult, ScoreResult } from "./types";

interface CategoryConfig {
  name: string;
  weight: number; // 0.35, 0.30, 0.20, 0.15
  rules: Array<(data: ListingData) => RuleResult>;
}

const CATEGORIES: CategoryConfig[] = [
  { name: 'Titre', weight: 0.35, rules: [calculateLengthScore, calculateFrontLoadingScore, calculateSeparatorScore, calculateDuplicateWordScore] },
  { name: 'Photos', weight: 0.30, rules: [calculatePhotoCountScore, calculateVideoScore] },
  { name: 'Complétude', weight: 0.20, rules: [calculatePriceScore, calculateShippingScore] },
  { name: 'Description', weight: 0.15, rules: [calculateDescLengthScore, calculateDescStructureScore, calculateTitleCoherenceScore] },
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
  const categoriesResults: CategoryResult[] = [];

  CATEGORIES.forEach(category => {
    const ruleResults = category.rules.map(rule => rule(data));

    const totals = ruleResults.reduce(
      (acc, r) => ({ score: acc.score + r.score, maxScore: acc.maxScore + r.maxScore }),
      { score: 0, maxScore: 0 }
    );

    const categoryScore = totals.maxScore === 0
    ? 0
    : Math.round((totals.score / totals.maxScore) * 100);

    if (totals.maxScore === 0) {
      console.warn(`Catégorie "${category.name}" n'a aucune règle avec maxScore > 0`);
    }

    const categoryResult: CategoryResult = {
      name: category.name,
      score: categoryScore,
      weight: category.weight,
      rules: ruleResults,
    }
    categoriesResults.push(categoryResult);
  });

  const globalScore = Math.round(categoriesResults.reduce((acc, category) => {
    return acc + category.score * category.weight;
  }, 0));
  
  return {
    globalScore: globalScore,
    grade: scoreToGrade(globalScore).name,
    categories: categoriesResults,
  };
}

function scoreToGrade(score: number): Grade {
  if (score < 0 || score > 100) {
    console.warn(`scoreToGrade: score hors bornes attendues (${score})`);
    score = Math.max(0, Math.min(100, score));
  }

  return GRADES.find(grade => score >= grade.minScore && score < grade.maxScore) || GRADES[GRADES.length - 1];
}

export default calculateScore;