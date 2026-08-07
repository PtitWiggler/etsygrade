import type ListingData from "../../content/listingData";
import type { RuleResult } from "../types";
import createBinaryRule from "../utils/binaryRule";
import { POINTS } from "./constants";

const PHOTO_COUNT_THRESHOLDS = [
  { min: 7, ratio: 1.0,  severity: 'tip' as const },
  { min: 5, ratio: 0.7,  severity: 'tip' as const },
  { min: 3, ratio: 0.4,  severity: 'warning' as const },
  { min: 0, ratio: 0,    severity: 'critical' as const },
];

function calculatePhotoCountScore(data: ListingData): RuleResult {
  const count = data.photoCount;
  const maxScore = POINTS.critical;
  const tier = PHOTO_COUNT_THRESHOLDS.find(t => count >= t.min)!;

  const recommendation = tier.ratio < 1
    ? `${count} photos. Les listings performants en utilisent 7+.`
    : null;

  return {
    score: Math.round(maxScore * tier.ratio),
    maxScore,
    recommendation,
    severity: tier.severity,
  };
}

function calculateVideoScore(data: ListingData): RuleResult {
    const hasVideo = data.hasVideo;
    return createBinaryRule(hasVideo, 'tip', "Ajoutez une vidéo (5–15 sec) pour plus d'engagement.");
}

export { calculatePhotoCountScore, calculateVideoScore };