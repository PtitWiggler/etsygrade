import type ListingData from "../../content/listingData";
import type { RuleResult } from "../types";
import createBinaryRule from "../utils/binaryRule";

function calculatePriceScore(data: ListingData): RuleResult {
    const hasPrice = data.price != null;
    return createBinaryRule(hasPrice, 'critical', "Prix non détecté");
}

function calculateShippingScore(data: ListingData): RuleResult {
    return createBinaryRule(data.hasShippingInfo, 'warning', "Informations de livraison manquantes");
}

export { calculatePriceScore, calculateShippingScore };