interface RuleResult {
  score: number;
  maxScore: number;
  recommendation: string | null;
  severity: 'critical' | 'warning' | 'tip';
}

interface CategoryResult {
  name: string;
  score: number;        // normalisé sur 100
  weight: number;        // 0.35, 0.30, 0.20, 0.15
  rules: RuleResult[];   // pour affichage détaillé plus tard
}

interface ScoreResult {
  globalScore: number;   // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  categories: CategoryResult[];
}

export type { RuleResult, CategoryResult, ScoreResult };