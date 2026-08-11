import type ListingData from "../../content/listingData";
import type { RuleResult } from "../types";
import createBinaryRule from "../utils/binaryRule";
import { POINTS } from "./constants";
import { NON_DESCRIPTIVE_WORDS, STOP_WORDS } from "./title-constants";

const TITLE_LENGTH_THRESHOLDS = [
  { min: 80, ratio: 1.0,  severity: 'tip' as const },
  { min: 40, ratio: 0.5,  severity: 'warning' as const },
  { min: 0, ratio: 0,    severity: 'critical' as const },
];

function calculateSeparatorScore(data: ListingData): RuleResult {
    if (data.title === null) {
        return createBinaryRule(false, 'critical', "Titre non détecté.");
    }

    const hasSeparator = data.title.includes('|') || data.title.includes(',') || data.title.includes('-');
    return createBinaryRule(hasSeparator, 'tip', "Structurez votre titre avec des séparateurs (|, -, ,).");
}

function calculateLengthScore(data: ListingData): RuleResult {
    if (data.title === null) {
        return createBinaryRule(false, 'critical', "Titre non détecté.");
    }

    const count = data.title.length;
    const maxScore = POINTS.critical;
    const tier = TITLE_LENGTH_THRESHOLDS.find(t => count >= t.min)!;
    
    const recommendation = tier.ratio < 1
        ? `Votre titre fait ${count} caractères. Étoffez-le (140 max).`
        : null;
    
    return {
        score: Math.round(maxScore * tier.ratio),
        maxScore,
        recommendation,
        severity: tier.severity,
    };
}

function calculateFrontLoadingScore(data: ListingData): RuleResult {
    if (data.title === null) {
        return createBinaryRule(false, 'critical', "Titre non détecté.");
    }

    const frontLoaded = data.title
        .split(/\s+/)[0]
        .toLowerCase()
        .replace(/[^\w]/g, '');

    const isNonDescriptiveWord = NON_DESCRIPTIVE_WORDS.includes(frontLoaded);
    return createBinaryRule(!isNonDescriptiveWord, 'warning', "Commencez par le type de produit ou le mot-clé principal.");
}

function calculateDuplicateWordScore(data: ListingData): RuleResult {
    if (data.title === null) {
        return createBinaryRule(false, 'critical', "Titre non détecté.");
    }

    const words = data.title
        .toLowerCase()
        .split(/\s+/)
        .map(word => word.replace(/[^\w]/g, ''))
        .filter(word => word.length > 0 && !STOP_WORDS.includes(word));

    const wordCounts: Record<string, number> = {};  
    for (const word of words) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    }

    const hasDuplicate = Object.values(wordCounts).some(count => count > 1);
    const mostDuplicateWord = Object.entries(wordCounts).reduce((maxWord, [word, count]) => {
        return count > (wordCounts[maxWord] || 0) ? word : maxWord;
    }, '');
    const nbMax = wordCounts[mostDuplicateWord] || 0;

    return createBinaryRule(!hasDuplicate, 'warning', `Le mot '${mostDuplicateWord}' apparaît ${nbMax} fois. Chaque mot devrait apporter une info nouvelle.`);
}

export { calculateSeparatorScore, calculateLengthScore, calculateFrontLoadingScore, calculateDuplicateWordScore };