# 🚀 Guide de Déploiement - EPS Manager

## 📋 Checklist Pré-Déploiement

- [ ] Créer compte Supabase
- [ ] Configurer base de données
- [ ] Configurer variables d'environnement
- [ ] Connecter repo à Vercel
- [ ] Déployer et tester

---

## 🗄️ ÉTAPE 1: Créer le Projet Supabase

### 1.1 Création du projet
1. Aller sur https://supabase.com
2. Créer un nouveau projet "eps-manager"
3. Noter les informations (elles seront dans les settings → API)

### 1.2 Configuration de la base de données

**Option A: Via SQL Editor (Recommandé)**

1. Dans Supabase Dashboard → SQL Editor
2. Copier le contenu de `docs/supabase-setup.sql`
3. Exécuter le script

**Option B: Via Console pgAdmin**
1. Ouvrir SQL Editor dans Supabase
2. Exécuter les requêtes manuellement

### 1.3 Récupérer les clés API

Aller dans **Project Settings → API**:
- `Project URL`: https://your-project-id.supabase.co
- `anon public key`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- `service_role key`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

---

## ⚙️ ÉTAPE 2: Configuration des Variables d'Environnement

### 2.1 Variables locales (.env.local)

```bash
# URL Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Service role (serveur uniquement)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_NAME=EPS Manager
```

### 2.2 Variables Production (Vercel)

Dans Vercel Dashboard → Settings → Environment Variables:

| Variable | Valeur | Type |
|----------|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxx.supabase.co | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJ... | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | eyJ... | Production (sensitive) |
| `NEXT_PUBLIC_APP_NAME` | EPS Manager | Production |

---

## 🚀 ÉTAPE 3: Déploiement sur Vercel

### 3.1 Connexion du repository

1. Aller sur https://vercel.com
2. Cliquer "Add New Project"
3. Importer depuis GitHub: `votre-repo/eps-manager`
4. Framework Preset: **Next.js**

### 3.2 Configuration du build

- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### 3.3 Variables d'environnement

Ajouter toutes les variables listées ci-dessus dans Vercel.

### 3.4 Déploiement

Cliquer sur **Deploy** !

---

## ✅ ÉTAPE 4: Vérification Post-Déploiement

### 4.1 Tests à effectuer

```bash
# 1. Vérifier que l'app charge
curl https://votre-app.vercel.app

# 2. Tester la connexion API
# Ouvrir la console navigateur → Network → vérifier les appels Supabase

# 3. Tester l'authentification
# Se connecter avec admin@eps.ci
```

### 4.2 Logs et debugging

- **Logs Vercel:** Dashboard → Deployments → View Logs
- **Logs Supabase:** Dashboard → Logs Explorer

---

## 🔧 Configuration Avancée

### Authentification (Optionnel)

Si vous voulez utiliser Supabase Auth:

1. Dans Supabase Dashboard → Authentication → Providers
2. Activer "Email" provider
3. Configurer les URLs de redirection:
   - Production: https://votre-app.vercel.app
   - Dev: http://localhost:3000

### Stockage de fichiers (Optionnel)

Pour les documents:

1. Supabase Dashboard → Storage
2. Créer un bucket "documents"
3. Configurer les policies RLS

---

## 🐛 Dépannage

### "Connection refused" à Supabase
→ Vérifier les variables d'environnement dans Vercel

### "RLS policy denied"
→ Vérifier les policies dans Supabase → Authentication → Policies

### Build échoue
→ Vérifier package.json → dépendances manquantes
→ Lancer `npm run build` localement

---

## 📞 Liens Utiles

- **Vercel:** https://vercel.com
- **Supabase:** https://supabase.com
- **Documentation Next.js:** https://nextjs.org/docs
- **Support EPS Manager:** admin@eps.ci