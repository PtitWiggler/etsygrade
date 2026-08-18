import type ListingData from "../../content/listingData";
import type { RuleResult } from "../types";
import createBinaryRule from "../utils/binaryRule";
import { POINTS } from "./constants";
import { STOP_WORDS } from "./title-constants";

const DESCRIPTION_LENGTH_THRESHOLDS = [
  { min: 500, ratio: 1.0,  severity: 'tip' as const },
  { min: 150, ratio: 0.5,  severity: 'warning' as const },
  { min: 0, ratio: 0,    severity: 'critical' as const },
];

function calculateDescLengthScore(data: ListingData): RuleResult {
    if (data.description === null) {
        return createBinaryRule(false, 'critical', "Description non détectée.");
    }

    const count = data.description.length;
    const maxScore = POINTS.critical;
    const tier = DESCRIPTION_LENGTH_THRESHOLDS.find(t => count >= t.min)!;
    
    const recommendation = tier.ratio < 1
        ? `Votre description fait ${count} caractères. Développez-la (500 min).`
        : null;
    
    return {
        score: Math.round(maxScore * tier.ratio),
        maxScore,
        recommendation,
        severity: tier.severity,
    };
}

function calculateDescStructureScore(data: ListingData): RuleResult {
    if (data.description === null) {
        return createBinaryRule(false, 'critical', "Description non détectée.");
    }

    return createBinaryRule(
        /\r?\n/.test(data.description),
        'warning',
        'Votre description est en un seul bloc. Structurez-la avec des paragraphes pour plus de lisibilité.'
    );
}

function calculateTitleCoherenceScore(data: ListingData): RuleResult {
    if (data.title === null || data.description === null) {
        return createBinaryRule(false, 'critical', "Titre ou description non détecté.");
    }

    const titleKeywords = data.title
        .toLowerCase()
        .split(/\s+/)
        .map(word => word.replace(/[^\w]/g, ''))
        .filter(word => word.length > 0 && !STOP_WORDS.includes(word));

    const descriptionLower = data.description.toLowerCase();

    const missingKeyword = titleKeywords.find(keyword => !descriptionLower.includes(keyword));

    return createBinaryRule(
        missingKeyword === undefined,
        'tip',
        `Le mot-clé '${missingKeyword}' du titre n'apparaît pas dans la description.`
    );
}

export { calculateDescLengthScore, calculateDescStructureScore, calculateTitleCoherenceScore };