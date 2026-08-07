import { describe, it, expect } from 'vitest';
import calculateScore from './scorer';
import type { ScoreResult } from './types';
import { mockListingData } from './utils/test-utils';

describe('calculateScore', () => {
    it('retourne le score total et les recommandations quand tous les champs sont présents', () => {
        const data = mockListingData({ price: "10.00", hasShippingInfo: true, photoCount: 7, hasVideo: true });
        const result: ScoreResult = calculateScore(data);
        expect(result.globalScore).toBe(50);
        expect(result.grade).toBe('D');
        expect(result.categories).toHaveLength(4);
    });

    it('retourne le score total et les recommandations quand tous les champs sont vides', () => {
        const data = mockListingData({ price: null, hasShippingInfo: false, photoCount: 0, hasVideo: false });
        const result: ScoreResult = calculateScore(data);
        expect(result.globalScore).toBe(0);
        expect(result.grade).toBe('F');
        expect(result.categories).toHaveLength(4);
    });
});