import { describe, it, expect } from 'vitest';
import calculateScore from './scorer';
import type { ScoreResult } from './types';
import { mockListingData } from './utils/test-utils';

describe('calculateScore', () => {
    it('retourne le score total et les recommandations quand tous les champs sont présents', () => {
        const data = mockListingData({ title: "Produit exceptionnel et absolument grandiose, ce mug est tout simplement incroyable et le meilleur objet que vous pouvez acheter !", 
            price: "10.00", hasShippingInfo: true, photoCount: 7, hasVideo: true });
        const result: ScoreResult = calculateScore(data);
        expect(result.globalScore).toBe(85);
        expect(result.grade).toBe('B');
        expect(result.categories).toHaveLength(4);
    });

    it('retourne le score total et les recommandations quand tous les champs sont vides', () => {
        const data = mockListingData({ title: null, price: null, hasShippingInfo: false, photoCount: 0, hasVideo: false });
        const result: ScoreResult = calculateScore(data);
        expect(result.globalScore).toBe(0);
        expect(result.grade).toBe('F');
        expect(result.categories).toHaveLength(4);
    });
});