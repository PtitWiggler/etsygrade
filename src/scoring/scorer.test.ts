import { describe, it, expect } from 'vitest';
import calculateScore from './scorer';
import type { ScoreResult } from './types';
import { mockListingData } from './utils/test-utils';

describe('calculateScore', () => {
    it('retourne le score total et les recommandations quand tous les champs sont présents', () => {
        const data = mockListingData({ title: "Produit exceptionnel et absolument grandiose, ce mug est tout simplement incroyable et le meilleur objet que vous pouvez acheter !", 
            description: "Ceci est une description détaillée du produit exceptionnel et absolument grandiose.\n Ce mug est tout simplement incroyable et le meilleur objet que vous pouvez acheter !\n Avec ce produit, c'est satisfaction garantie ! Aucun autre mug au monde ne vous procurera un tel bonheur. Ce mug a été élu mug numéro 1 par un ensemble d'experts en mugs et a reçu de nombreux prix pour sa qualité et son design. Ne manquez pas cette opportunité unique d'acquérir le meilleur mug du marché ! En ce moment uniquement, profitez de notre offre spéciale et obtenez ce mug exceptionnel à un prix imbattable. Commandez dès maintenant et rejoignez la communauté des heureux propriétaires de ce mug incroyable !", 
            price: "10.00", hasShippingInfo: true, photoCount: 7, hasVideo: true });
        const result: ScoreResult = calculateScore(data);
        expect(result.globalScore).toBe(100);
        expect(result.grade).toBe('A');
        expect(result.categories).toHaveLength(4);
    });

    it('retourne le score total et les recommandations quand tous les champs sont vides', () => {
        const data = mockListingData({ title: null, description: null, price: null, hasShippingInfo: false, photoCount: 0, hasVideo: false });
        const result: ScoreResult = calculateScore(data);
        expect(result.globalScore).toBe(0);
        expect(result.grade).toBe('F');
        expect(result.categories).toHaveLength(4);
    });
});