# EZAKI Parfum — boutique en ligne

Site e-commerce premium pour la marque marocaine **EZAKI Parfum**
(@ezaki_parfum — « Parfums de luxe au Maroc »), construit avec Next.js,
TypeScript et Tailwind CSS.

Identité visuelle : noir profond + or (`#080808`, `#111111`, `#C9A227`,
`#E5C76B`, `#F5F1E8`), typographie serif élégante (Playfair Display) +
sans-serif moderne (Inter), mise en page mobile-first, touches arabes
décoratives et conversion principale via WhatsApp.

## Stack

- **Next.js 15** (App Router, React 19, rendu statique)
- **TypeScript** strict
- **Tailwind CSS 3** (thème personnalisé `ink` / `gold` / `cream`)
- **lucide-react** pour les icônes
- Aucune dépendance UI externe : composants maison réutilisables

## Démarrage rapide

```bash
npm install     # dependances deja installees dans ce dossier
npm run dev     # http://localhost:3000
npm run build   # synchronise EZAKI, les photos, puis lance le build de production
npm start       # serveur de production
npm run typecheck
```

### Synchroniser le catalogue EZAKI

Le catalogue effectif combine les champs synchronisables de la boutique officielle
(nom, prix, image et URL source) avec les metadonnees de secours de
`lib/products.ts`. La synchronisation se lance cote serveur avant une mise a jour
du catalogue :

```bash
npm run sync-products
```

Le script recupere les pages produit EZAKI, valide les donnees, telecharge les
images dans `public/images/products/`, puis remplace atomiquement les fichiers
generes `lib/products.synced.generated.ts` et
`lib/product-source-map.generated.json`. Le site ne contacte pas EZAKI dans le
navigateur ni pendant son fonctionnement : si la boutique est indisponible, le
dernier catalogue genere et le catalogue de secours local restent utilises.

`npm run build` lance automatiquement ce processus avant `next build`, dans
l'ordre suivant :

```text
prebuild -> npm run sync-products -> npm run photos -> next build
```

La synchronisation est executee une seule fois par build. Si EZAKI est
indisponible ou si les donnees sont invalides, `sync-products` echoue sans
remplacer les fichiers synchronises valides ; le build s'arrete volontairement
pour eviter de publier un catalogue partiellement mis a jour. Le site peut
toujours fonctionner avec le dernier catalogue genere et les donnees de secours
de `lib/products.ts`. `npm run sync-products` reste disponible pour une mise a
jour manuelle avant un build ulterieur.

> **Node.js n'est pas installé sur ce poste.** Un runtime portable a été
> installé dans `C:\Users\kansm\ezaki-tools\node` (v22.12.0) et
> `node_modules` est un lien (junction) vers
> `C:\Users\kansm\ezaki-node-modules` afin de ne pas synchroniser OneDrive.
> Pour lancer le projet dans un terminal :
>
> ```powershell
> $env:PATH = 'C:\Users\kansm\ezaki-tools\node;' + $env:PATH
> npm run dev
> ```
>
> Pour revenir à une installation classique : installer Node.js depuis
> <https://nodejs.org>, supprimer le lien `node_modules`, puis `npm install`.

## Pages

| Route | Contenu |
| --- | --- |
| `/` | Hero, engagements, parfums mis en avant, offre du moment, comment commander, grid Instagram, avis, à propos |
| `/parfums` | Collection complète, filtres par catégorie et tri par prix |
| `/parfums/[slug]` | Fiche produit : galerie, notes de tête/cœur/fond, quantité, panier, WhatsApp |
| `/a-propos` | Histoire de la marque, valeurs, fonctionnement |
| `/contact` | Coordonnées, formulaire de commande WhatsApp, livraison, FAQ |
| `/panier` | Panier persistant (localStorage), récapitulatif et envoi de la commande |
| `/sitemap.xml`, `/robots.txt` | SEO technique |

## Où modifier le contenu

| Fichier | Contenu |
| --- | --- |
| `lib/products.ts` | **Catalogue complet** : nom, prix, ancien prix, notes olfactives, image, badge, stock… |
| `lib/site.ts` | Nom, slogan, téléphone, lien WhatsApp, Instagram, livraison |
| `lib/content.ts` | Engagements, avis clients, grid Instagram, statistiques |
| `app/*/page.tsx` | Textes éditoriaux des pages |
| `components/**` | Composants réutilisables (`ui`, `layout`, `home`, `product`, `cart`, `contact`) |

### Ajouter / modifier un parfum

```ts
// lib/products.ts
{
  id: 'ezaki-nuit',
  slug: 'ezaki-nuit',          // URL : /parfums/ezaki-nuit
  name: 'EZAKI Nuit',
  price: 189,
  oldPrice: 219,               // optionnel : affiche le prix barré + badge -%
  image: '/images/products/ezaki-nuit.svg', // ou une photo dans /public/images/products
  // …voir le type Product pour tous les champs
}
```

La page produit, les prix, les badges de remise, les liens WhatsApp et le
sitemap se mettent à jour automatiquement.

### Visuels

`scripts/generate-assets.mjs` génère les visuels vectoriels premium
(flacons, coffret, lifestyle, logo, favicon) :

```bash
node scripts/generate-assets.mjs
```

Pour utiliser de vraies photos : déposez-les dans
`public/images/products/` puis mettez à jour le champ `image` du produit
(les images sont optimisées par le composant `next/image`).

## Administration Supabase

Une base d’intégration Supabase est préparée pour le futur dashboard sécurisé :

- `lib/supabase/client.ts` : client navigateur avec la clé anon uniquement.
- `lib/supabase/server.ts` : client serveur avec gestion de session.
- `middleware.ts` : vérification de session avant les routes `/admin`.
- `app/admin/login` : connexion Supabase Auth.
- `app/admin` et `app/admin/products` : dashboard et catalogue protégés.
- `supabase/migrations/001_products.sql` : tables `products`, `admin_users`,
  `product_audit_log` et règles RLS.
- `supabase/storage.sql` : bucket public en lecture `product-images`, écriture
  réservée aux administrateurs.

Le fichier `.env.local` doit rester à la racine du projet et ne doit jamais être
commité. Il contient uniquement `NEXT_PUBLIC_SUPABASE_URL` et
`NEXT_PUBLIC_SUPABASE_ANON_KEY` pour cette phase. La clé service-role n’est pas
utilisée par le navigateur.

Avant d’utiliser `/admin`, exécutez les deux fichiers SQL dans le SQL Editor
Supabase, créez un utilisateur dans Supabase Auth, puis ajoutez son UUID dans
`public.admin_users`. La migration Supabase n’est pas exécutée automatiquement
par le build et le catalogue public local reste inchangé tant que la migration
et la future importation ne sont pas validées.