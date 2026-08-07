import type ListingData from "../../content/listingData";
import type { RuleResult } from "../types";
import { POINTS } from "./constants";

function calculatePriceScore(data: ListingData): RuleResult {
    const hasPrice = data.price != null;
    return createBinaryRule(hasPrice, 'critical', "Prix non détecté");
}

function calculateShippingScore(data: ListingData): RuleResult {
    return createBinaryRule(data.hasShippingInfo, 'warning', "Informations de livraison manquantes");
}

function createBinaryRule(condition: boolean, ruleSeverity: 'critical' | 'warning' | 'tip', message: string): RuleResult {
    return {
        score: condition ? POINTS[ruleSeverity] : 0,
        maxScore: POINTS[ruleSeverity],
        recommendation: condition ? null : message,
        severity: ruleSeverity
    }
}

export { calculatePriceScore, calculateShippingScore };