# Boutique — Plateforme E-commerce Mixte & Enfant

Plateforme e-commerce sur-mesure : catalogue produits, panier, commandes,
gestion de stock par variante (taille/couleur), paiement CMI ou à la
livraison, back-office admin.

## Stack
- Next.js 14 (App Router, TypeScript)
- PostgreSQL + Prisma
- NextAuth (authentification)
- Tailwind CSS
- Zustand (panier persistant)
- CMI (paiement en ligne Maroc) + option paiement à la livraison

## Installation

```bash
npm install
cp .env.example .env
# Remplir .env : DATABASE_URL, NEXTAUTH_SECRET, identifiants CMI, Cloudinary...

npx prisma db push       # crée les tables en base
npm run db:seed          # ajoute un compte admin + produits de démo

npm run dev
```

Ouvrir http://localhost:3000

Compte admin de démo (après seed) : `admin@boutique.ma` / `changeMoi123`
**À changer immédiatement en production.**

## Paiement CMI

Le paiement par carte nécessite un **contrat marchand CMI** auprès d'une
banque marocaine (Attijariwafa, BMCE, BCP...). Une fois le contrat obtenu,
la banque fournit :
- `CMI_MERCHANT_ID` (clientid)
- `CMI_STORE_KEY` (clé de signature)
- l'URL de production (à remplacer dans `.env`, actuellement configurée
  en mode test)

Le fichier `src/lib/cmi.ts` génère le formulaire de paiement 3D Secure et
vérifie le hash de retour. **À tester en mode sandbox CMI avant mise en
production**, et à ajuster précisément selon la documentation technique
fournie par la banque (le format exact du hash peut varier légèrement
selon les banques partenaires de CMI).

En attendant l'obtention du contrat CMI, le **paiement à la livraison**
(déjà fonctionnel) permet de lancer la boutique immédiatement.

## Structure du projet

```
prisma/schema.prisma       → modèle de données complet
src/app/                   → pages (App Router)
  produits/                → catalogue + fiche produit
  panier/, checkout/       → tunnel d'achat
  admin/                   → back-office (à étoffer : CRUD produits, commandes)
  api/                     → routes API (produits, commandes, paiement, auth)
src/lib/                   → prisma client, auth, intégration CMI
src/store/cart.ts          → état du panier (persisté localStorage)
```

## À compléter avant mise en production

1. **Protection des routes admin** — ajouter un middleware qui vérifie
   `role === "ADMIN"` sur `/admin/*` et les routes API de modification.
2. **CRUD produits admin** — formulaires d'ajout/édition produits et
   gestion des images (upload vers Cloudinary, helper à ajouter dans
   `src/lib/cloudinary.ts`).
3. **Emails transactionnels** — confirmation de commande (Resend, Brevo...).
4. **Livraison** — intégrer un transporteur marocain (Amana, Cathedis...)
   si le suivi de colis est souhaité.
5. **Hébergement** — Vercel (frontend) + base PostgreSQL managée
   (Neon, Supabase, ou serveur dédié Technopark).
6. **Tests** du parcours de paiement CMI en mode sandbox avant le switch
   en production.

## Notes de conception

- Le stock est décrémenté **à la création de la commande** (pas à la
  confirmation du paiement) pour éviter la survente. En cas d'échec de
  paiement CMI, le stock est automatiquement remis (voir
  `api/paiement/cmi/retour/route.ts`).
- Les prix sont toujours recalculés **côté serveur** à la commande —
  jamais fait confiance aux montants envoyés par le client.
- Livraison gratuite au-delà d'un seuil configurable (`LIVRAISON_GRATUITE_DES`
  dans `.env`).
