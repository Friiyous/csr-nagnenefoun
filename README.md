# EPS Manager - Application Web de Gestion Hospitalière

EPS Manager est une application web de gestion hospitalière conçue spécifiquement pour les Établissements Publics de Santé de Côte d'Ivoire (EPS), conforme au système PBF (Performance-Based Financing).

## 1.2 Objectifs

- Digitaliser la gestion des EPS en Côte d'Ivoire
- Suivre les indicateurs PBF en temps réel
- Gérer les ressources humaines, financières et matérielles
- Faciliter la communication entre agents de santé

## 1.3 Public cible

- Directeurs d'EPS
- Chefs de service
- Infirmiers/ères
- Médecins
- Pharmaciens
- Agents administratifs
- Personnel d'hygiène

---

## Architecture Technique

### Stack technologique

- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Next.js API Routes + Prisma
- **Base de données**: PostgreSQL
- **Authentification**: NextAuth.js (JWT)
- **Charts**: Recharts
- **Icons**: Lucide React

### Structure du projet

```
EPSManager/
├── app/                       # Application Next.js 14
│   ├── (auth)/               # Routes d'authentification
│   │   ├── login/page.tsx    # Page de connexion
│   │   └── layout.tsx        # Layout auth
│   ├── (dashboard)/          # Application principale
│   │   ├── layout.tsx        # Layout avec sidebar
│   │   ├── page.tsx          # Dashboard
│   │   └── modules/          # Modules fonctionnels
│   │       ├── rh/page.tsx   # Ressources Humaines
│   │       ├── finance/page.tsx # Finance & PBF
│   │       ├── patients/page.tsx # Patients
│   │       ├── pharmacie/page.tsx # Pharmacie/Stocks
│   │       ├── hygiene/page.tsx # Hygiène
│   │       ├── stats/page.tsx # Statistiques
│   │       └── annuaire/page.tsx # Annuaire
│   ├── api/                  # API routes
│   └── layout.tsx            # Root layout
├── components/               # Composants React
│   ├── ui/                   # Composants UI réutilisables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Table.tsx
│   │   ├── Modal.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── StatsCard.tsx
│   └── charts/               # Composants de graphiques
├── store/                    # State management (Zustand)
│   └── useAppStore.ts
├── lib/                      # Utilitaires
│   ├── api.ts
│   ├── auth.ts
│   └── utils.ts
├── types/                    # Types TypeScript
│   └── index.ts
├── constants/                # Constantes
│   └── index.ts
├── prisma/                   # Base de données
│   └── schema.prisma
├── middleware.ts             # Protection des routes
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── package.json
└── tsconfig.json
```

---

## Installation

### Prérequis

- Node.js 18+
- npm ou yarn ou pnpm
- PostgreSQL (local ou Supabase/Neon)

### Installation

```bash
# Cloner le projet
cd ~/EPSManager

# Installer les dépendances
npm install

# Configurer la base de données
npx prisma db push

# Lancer l'application en développement
npm run dev
```

### Variables d'environnement (.env.local)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/epsmanager"
NEXTAUTH_SECRET="votre-secret-nextauth"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Déploiement

### Vercel (recommandé)

```bash
npm run build
# Vercel détecte automatiquement Next.js
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

---

## Fonctionnalités

Voir le document de spécification complet pour les détails de chaque module.