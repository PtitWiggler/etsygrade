import { POINTS } from "../rules/constants";
import type { RuleResult } from "../types";

function createBinaryRule(condition: boolean, ruleSeverity: 'critical' | 'warning' | 'tip', message: string): RuleResult {
    return {
        score: condition ? POINTS[ruleSeverity] : 0,
        maxScore: POINTS[ruleSeverity],
        recommendation: condition ? null : message,
        severity: ruleSeverity
    }
}

export default createBinaryRule;