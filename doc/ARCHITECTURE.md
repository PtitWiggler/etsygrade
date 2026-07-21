# EtsyGrade — Architecture & Scope Document

> **Ce document est la source de vérité du projet.**
> Toute décision d'architecture, tout changement de scope y est consigné.
> Dernière mise à jour : 2026-07-21

---

## 1. Pitch

Extension Chrome qui scanne un listing Etsy et affiche un score (A–F) + des recommandations concrètes pour l'améliorer.

## 2. Scope v1 — VERROUILLÉ

### Flow utilisateur

1. L'utilisateur est sur `etsy.com/listing/*`
2. Il clique sur l'icône de l'extension
3. Le popup s'ouvre, scrape la page, calcule un score
4. Affiche le résultat avec des conseils actionnables

### Stack technique

- React 18 + TypeScript + Vite
- Manifest V3
- Pas de backend, pas d'API externe, pas d'IA
- Toute la logique tourne côté client
- Chrome Storage API pour settings + compteur freemium
- ExtensionPay pour le paiement one-time

### Langues

- Interface : anglais par défaut, français disponible
- Système i18n simple (fichiers JSON de traductions)
- Les règles de scoring sont indépendantes de la langue du listing

### Monétisation

- Freemium : 3 analyses gratuites / jour
- Au-delà : paiement unique (4.99$ ou 7.99$, à tester)
- Intégration via ExtensionPay (zéro backend)

### 4 états du popup

| État | Condition | Affichage |
|------|-----------|-----------|
| Pas sur un listing | URL ne match pas `etsy.com/listing/*` | Message d'instruction |
| Analyse en cours | Scraping + calcul | Loader |
| Résultat | Score calculé | Note + catégories dépliables |
| Limite atteinte | 3 analyses/jour épuisées | CTA premium |

---

## 3. Système de scoring

### Architecture

Chaque règle est une fonction pure :
```typescript
interface RuleResult {
  score: number;          // points obtenus
  maxScore: number;       // points possibles
  recommendation: string | null; // null = tout va bien
  severity: 'critical' | 'warning' | 'tip';
}
```

Score catégorie = Σ scores / Σ maxScores (normalisé sur 100)
Score global = moyenne pondérée des catégories
Note : A = 90+, B = 75–89, C = 60–74, D = 40–59, F = 0–39

### Catégories et pondérations

| Catégorie   | Poids | Justification |
|-------------|-------|----------------|
| Titre       | 35%   | Seul signal de pertinence textuelle exploitable côté client (les tags SEO ne sont pas accessibles depuis la page publique) |
| Photos      | 30%   | Facteur direct de CTR sur les résultats de recherche, alimente le ranking via le taux de conversion |
| Complétude  | 20%   | Inclut le prix de livraison (facteur de ranking documenté par Etsy) et la présence du prix |
| Description | 15%   | Signal algorithmique faible côté recherche interne Etsy ; utile surtout pour la conversion et le SEO externe (Google) |

> **Tags retirés du scope v1** : les 13 tags SEO d'un listing ne sont exposés ni en HTML rendu ni en JSON-LD sur `etsy.com/listing/*` (donnée interne au moteur de recherche Etsy, saisie via Shop Manager, jamais restituée sur la page publique). Voir décision du 2026-07-21 en section 7.

### Règles détaillées par catégorie

#### TITRE (35%)

| Règle | Check | Sévérité | Recommandation type |
|-------|-------|----------|---------------------|
| Longueur | 80–140 chars = OK, 40–80 = warning, <40 = critical | critical/warning | "Votre titre fait X caractères. Étoffez-le (140 max)." |
| Front-loading | Ne commence pas par mots non-descriptifs (Beautiful, Amazing, Unique...) | warning | "Commencez par le type de produit ou le mot-clé principal." |
| Séparateurs | Présence de \|, -, ou , pour structurer | tip | "Structurez votre titre avec des séparateurs (\|)." |
| Répétition | Pas de mot dupliqué (hors stop words) | warning | "Le mot 'X' apparaît N fois. Chaque mot devrait apporter une info nouvelle." |

#### PHOTOS (30%)

| Règle | Check | Sévérité | Recommandation type |
|-------|-------|----------|---------------------|
| Nombre | 7+ = excellent, 5–6 = OK, 3–4 = warning, 1–2 = critical | critical/warning | "X photos. Les listings performants en utilisent 7+." |
| Vidéo | Présence d'une vidéo | tip | "Ajoutez une vidéo (5–15 sec) pour plus d'engagement." |

#### DESCRIPTION (15%)

| Règle | Check | Sévérité | Recommandation type |
|-------|-------|----------|---------------------|
| Longueur | 500+ = OK, 150–500 = warning, <150 = critical | critical/warning | "Description de X caractères. Développez-la." |
| Structure | Présence de retours à la ligne | warning | "Votre description est un seul bloc. Structurez-la." |
| Cohérence titre | Mots-clés du titre présents dans la description | tip | "Le mot-clé 'X' du titre n'apparaît pas dans la description." |

#### COMPLÉTUDE (20%)

| Règle | Check | Sévérité | Recommandation type |
|-------|-------|----------|---------------------|
| Prix | Renseigné | critical | "Prix non détecté." |
| Livraison | Info visible | warning | "Informations de livraison manquantes." |

> **Section boutique retirée du scope v1** : voir décision du 2026-07-21 en section 7.

---

## 4. Milestones

| # | Nom | Estimation | Contenu |
|---|-----|-----------|---------|
| 0 | Hello EtsyGrade | 2h | Scaffold Vite+React+TS+Manifest V3, popup "Hello" |
| 1 | Hello Etsy | 8h | Détection listing, extraction titre, affichage popup |
| 2 | Le Scraper | 8h | Content script complet, extraction toutes données |
| 3 | Le Scorer | 8h | Algorithme de scoring, affichage notes + recommandations |
| 4 | Le Polish | 6h | UI propre, i18n FR/EN, 4 états, couleurs, animations |
| 5 | Le Business | 6h | Freemium gate, ExtensionPay, landing page, publication |

**Total estimé : ~38h (5–6 semaines à 7h/semaine)**

---

## 5. Arborescence cible (v1)

```
etsygrade/
├── public/
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── popup/           # React app (le popup)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── components/
│   ├── content/         # Content script (scraping)
│   │   ├── scraper.ts
│   │   ├── listingData.ts
│   │   ├── extractors/
│   │   │   ├── title.ts
│   │   │   ├── completeness.ts
│   │   │   ├── description.ts
│   │   │   └── photos.ts
│   │   └── utils/
│   │       └── jsonLd.ts
│   ├── background/      # Service worker
│   │   └── service-worker.ts
│   ├── scoring/         # Logique métier
│   │   ├── types.ts
│   │   ├── rules/
│   │   │   ├── title.ts
│   │   │   ├── photos.ts
│   │   │   ├── description.ts
│   │   │   └── completeness.ts
│   │   └── scorer.ts
│   ├── i18n/            # Traductions
│   │   ├── en.json
│   │   └── fr.json
│   └── utils/
├── vite.config.ts
├── tsconfig.json
├── package.json
└── BACKLOG_V2.md
```

---

## 6. BACKLOG_V2.md — NE PAS TOUCHER AVANT PUBLICATION v1

- Suggestions IA (réécriture de titre, génération de tags)
- Analyse de boutique entière (batch)
- Analyse de concurrents
- Keyword research / volume de recherche
- Historique des scores
- Dashboard / page d'options complexe
- Backend / API
- Support Firefox / Edge
- Système d'abonnement mensuel
- Notifications
- Export PDF du rapport

---

## 7. Décisions d'architecture

| Date | Décision | Justification |
|------|----------|---------------|
| 2026-06-15 | Pas de backend en v1 | Réduit la complexité, scoring 100% client-side |
| 2026-06-15 | ExtensionPay pour paiement | Zéro infra backend pour le billing |
| 2026-06-15 | i18n par fichiers JSON | Simple, pas de dépendance lourde (pas de react-intl) |
| 2026-06-15 | Scoring par règles indépendantes | Testable, extensible, chaque règle = une recommandation |
| 2026-07-07 | Build via `build.rolldownOptions` (Vite 8, remplace `rollupOptions` déprécié), `input` en objet nommé + `output.entryFileNames: '[name].js'` | Produit des chemins de sortie prévisibles (`content/scraper.js`, `background/service-worker.js`) requis par le manifest, qui ne peut pas référencer du TS source ni des noms hashés |
| 2026-07-07 | `matches` du content script inclut `*://www.etsy.com/listing/*` ET `*://www.etsy.com/*/listing/*` | Couvre les URLs localisées (`/fr/listing/`, `/uk/listing/`, etc.) |
| 2026-07-07 | Détection "page listing" dupliquée manifest (match pattern) + popup (regex `/etsy\.com\/(\w{2}\/)?listing\//`) | Deux mécanismes indépendants : le manifest contrôle l'injection du content script par Chrome, la regex popup contrôle l'état d'affichage React. Duplication assumée. |
| 2026-07-07 | Format de message unifié `{ data: ... }` sur toute la chaîne popup → background → content script | Contrat unique évite les formats mixtes (objet vs string) entre les scripts |
| 2026-07-07 | `tsconfig.app.json` : `"types"` explicite doit lister `"vite/client"` ET `"chrome"` | Spécifier `types` explicitement désactive le chargement automatique de tous les `@types/*` ; `@types/chrome` doit être ajouté manuellement |
| 2026-07-21 | Suppression de la catégorie Tags du scoring v1 ; poids redistribués (Titre 35%, Photos 30%, Complétude 20%, Description 15%) | Les 13 tags SEO d'un listing Etsy ne sont exposés ni en HTML rendu ni en JSON-LD sur `etsy.com/listing/*` (donnée interne au moteur de recherche Etsy, saisie via Shop Manager). Scraper cette donnée nécessiterait de cibler la page d'édition vendeur, hors scope du flow "scan d'un listing public". Redistribution basée sur l'impact réel des signaux restants sur le ranking Etsy (pertinence textuelle du titre, CTR des photos, livraison) plutôt qu'une répartition proportionnelle arbitraire. |
| 2026-07-21 | Suppression du champ `shopSection` de `ListingData` / catégorie Complétude | La section de boutique assignée par le vendeur (Shop Manager) n'est exposée ni dans le DOM ni dans aucun JSON-LD de la page publique `etsy.com/listing/*` — vérifié par inspection manuelle (encart vendeur, code source complet, BreadcrumbList JSON-LD qui ne contient que la taxonomie Etsy globale). Complétude repose sur 2 sous-critères : Prix et Livraison. |
| 2026-07-21 | Source de données privilégiée pour le scraping : JSON-LD (`script[type="application/ld+json"]`) plutôt que le DOM visuel, via un helper générique `findJsonLdByType` avec type guards | Le JSON-LD est un contrat SEO plus stable que les classes/structure CSS d'Etsy (sujettes à changements fréquents, A/B tests). Utilisé pour titre (fallback DOM), prix, description, nombre de photos, présence vidéo. |
| 2026-07-21 | `retrievePrice` gère `Offer` (prix unique) et `AggregateOffer` (variantes, `lowPrice`/`highPrice`) via discriminated union sur `@type` | Un listing à variantes de prix expose un `AggregateOffer` en JSON-LD tant qu'aucune option n'est sélectionnée ; le format bascule en `Offer` simple une fois une variante choisie. Format de sortie pour `ListingData.price` : range formatée `"lowPrice - highPrice"` quand agrégée. |
| 2026-07-21 | `hasShippingInfo` extrait du DOM (`[data-selector="shipping-highlights"]`), pas du JSON-LD | Le champ `offers.shippingDetails` du JSON-LD est présent même sur les listings digitaux (sans livraison physique réelle) — signal non discriminant. Le sélecteur DOM, lui, est absent sur les listings digitaux et présent sur les listings physiques, vérifié empiriquement sur les deux cas. |

---

## 8. Journal d'avancement

| Date | Milestone | Ce qui a été fait |
|------|-----------|-------------------|
| 2026-06-15 | Pré-projet | Scope v1 verrouillé, scoring défini, architecture posée |
| 2026-07-07 | Milestone 1 (Hello Etsy) | Détection listing Etsy (toutes locales), extraction titre H1 via content script, relais popup ↔ service worker ↔ content script, affichage conditionnel popup (titre / message d'instruction). Build Vite/Rolldown validé avec 3 entry points aux chemins corrects. |
| 2026-07-21 | Milestone 2 (Le Scraper) | Extraction complète des données de listing via 4 extracteurs modulaires (`title`, `completeness`, `description`, `photos`) sous `src/content/extractors/`, chacun typé `(doc: Document) => T` et testable indépendamment. Source de données privilégiée : JSON-LD (`script[type="application/ld+json"]`) via un helper générique `findJsonLdByType` avec type guards, plus fiable que le DOM visuel (résiste aux changements de mise en page/A-B tests Etsy). Fallback DOM uniquement pour `hasShippingInfo` (signal JSON-LD non discriminant entre listings physiques et digitaux, vérifié empiriquement). `scraper.ts` assemble les résultats via un message unique `SCRAPE_LISTING`, réponse au format unifié `{ data: ListingData }`. Champs `tags` et `shopSection` retirés du scope (données non exposées côté page publique). |
