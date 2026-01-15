# 📋 Guide de Configuration des Sessions EPS Manager

Ce document vous guide pour personnaliser chaque section de l'application selon les besoins réels de votre centre de santé.

---

## 🏥 1. Configuration de l'EPS

### Paramètres de base
```
Nom de l'établissement: [À remplir]
Code EPS: CSR-XXX-XXX
Type: CSR / CSU / HOPITAL / DISPENSAIRE
Région: [Votre région]
District: [Votre district]
Adresse: [Adresse complète]
Téléphone: [Numéro]
Email: [Email institutionnel]
```

### Sections du centre à définir:
- Services disponibles (consultation, urgences, laboratoire, imagerie, etc.)
- Horaires d'ouverture
- Capacités (lits, consultations/jour, etc.)

---

## 👥 2. Gestion du Personnel

### Structure organisationnelle
```
Direction:
  - Directeur/Directrice
  - Directeur adjoint

Services:
  - Service médical (Médecins)
  - Service nursing (Infirmiers/ères)
  - Service pharmaceutique (Pharmaciens)
  - Service administratif
  - Service hygiene
  - Service technique
```

### Catégories professionnelles (Fonction Publique Ivoirienne)
```
Catégorie A: Cadres supérieurs
  - Médecins, Pharmaciens, Dentistes
  
Catégorie B: Cadres moyens  
  - Infirmiers/ères supérieur(e)s, Sage-femmes
  - Techniciens de laboratoire
  
Catégorie C: Employés
  - Agents administratifs, Secrétaires médicales
  
Catégorie D: Ouvriers
  - Agents d'hygiène, Manutentionnaires
```

### Fonctions selon le besoin du centre
- Médecin Chef
- Médecin
- Chirurgien
- Pédiatre
- Gynécologue
- Pharmacien
- Infirmier/ère
- Sage-femme
- Technicien de laboratoire
- Agent administratif
- Agent d'hygiène
- Gardien
- Chauffeur
- etc.

---

## 🗓️ 3. Gestion des Congés

### Types de congés (Fonction publique)
1. **Congé annuel** - 30 jours ouvrables
2. **Congé maladie** - Sur présentation certificat
3. **Congé maternité** - 14 semaines (98 jours)
4. **Congé paternité** - 3 jours
5. **Congé sans solde** - Autorisation exceptionnelle
6. **Congé de représentation** - Missions

### Workflow d'approbation
```
Demande → Chef Service → Directeur → Statut final
                     ↓
              (Approuvé/Refusé)
```

---

## ⏰ 4. Planning des Gardes

### Organisation des services 24h/24
```
Urgences: 2 personnes/jour (1 médecin + 1 infirmier)
Maternité: 2 personnes/jour (1 sage-femme + 1 infirmier)
Pharmacie: 1 personne/jour
Administration: 1 personne/jour
```

### Types de garde
- **Jour**: 07h - 19h
- **Nuit**: 19h - 07h
- **Week-end**: Samedi 07h - Lundi 07h
- **Jour férié**: Selon planning

---

## 💰 5. Finance & PBF

### Structure budgétaire
```
RECETTES:
  - Subvention PBF (Performance-Based Financing)
  - Recettes propres (consultations)
  - Vente de médicaments
  - Autres

DÉPENSES:
  - Salaires (gestion centrale)
  - Médicaments et consommables
  - Fonctionnement
  - Équipements
```

### Indicateurs PBF (à adapter)
| Code | Indicateur | Unité | Prix unitaire |
|------|-----------|-------|---------------|
| PBF-CONS | Consultation curative | Consultation | 500-1000 |
| PBF-CPN1 | CPN1 (1ère visite) | Consultation | 2000 |
| PBF-ACCOU | Accouchement eutocique | Accouchement | 5000 |
| PBF-VACC | Vaccination complète | Enfant | 3000 |
| PBF-CHIR | Petite chirurgie | Intervention | 3000 |

---

## 💊 6. Pharmacie

### Catégories de produits
1. **Médicaments essentiels** - Liste nationale
2. **Consommables médicaux** - Gants, seringues, etc.
3. **Réactifs de laboratoire**
4. **Produits d'hygiène**
5. **Équipements médicaux**

### Gestion des alertes
- **Alerte rouge**: Stock = 0 (Rupture)
- **Alerte orange**: Stock < 50% du seuil
- **Alerte jaune**: Stock < 75% du seuil

### Localisations de stockage
```
Armoire A: Médicaments solides (comprimés, gélules)
Armoire B: Médicaments liquides (sirops)
Armoire C: Injections et perfusions
Armoire D: Psychotropes et stupéfiants (verrouillé)
Réfrigérateur: Vaccins et insuline
Stock principal: Grosses quantités
```

---

## 🧹 7. Hygiène & Sécurité

### Checklists par zone
```
Salle de consultation:
  - Nettoyage des surfaces
  - Désinfection du matériel
  - Poubelles vidées

Laboratoire:
  - Décontamination des déchets
  - Stérilisation du matériel
  - Contrôle des réactifs

Bloc opératoire:
  - Stérilisation complète
  - Contrôle de température
  - Préparation du matériel

Pharmacie:
  - Contrôle des dates de péremption
  - Conditions de stockage
  - Inventaire

Couloirs et communs:
  - Sols nettoyés
  -WC entretenus
  -Déchets éliminés
```

### Fréquence des contrôles
- **Quotidien**: Toutes les zones
- **Hebdomadaire**: Nettoyage en profondeur
- **Mensuel**: Audit complet

---

## 📁 8. Archives & Documents

### Catégories
```
RH:
  - Fiches de personnel
  - Arrêtés de nomination
  - Congés et absences
  - Formations

Administration:
  - Procès-verbaux CA
  - Rapports d'activité
  - Correspondances
  - Marchés publics

Finance:
  - Rapports PBF
  - Comptes annuels
  - Factures
  - Bordereaux

Pharmacie:
  - Inventaires
  - Bons de commande
  - Factures fournisseurs
  - Contrôles qualité

Hygiène:
  - Rapports d'audit
  - Procès-verbaux de contrôle
  - Certifications
```

### Types de documents
- PDF (Rapports, PV)
- DOCX (Courriers, conventions)
- XLSX (Tableaux de bord, inventaires)
- Images (Photos, scans)

---

## 📞 9. Annuaire

### Contacts par service
```
Direction:
  - Directeur: [Nom] - [Téléphone]
  - Secrétariat: [Téléphone]

Service Médical:
  - Médecin Chef: [Nom] - [Téléphone]
  - Urgences: [Numéro direct]

Service Nursing:
  - Chef nursing: [Nom] - [Téléphone]
  - Standard: [Numéro]

Pharmacie:
  - Pharmacien: [Nom] - [Téléphone]
  - Garde pharmacie: [Numéro]

Services externes:
  - SAMU: 143
  - Centre antipoison: [Numéro]
  - Laboratoire régional: [Numéro]
```

---

## ⚙️ 10. Rôles et Permissions

### Matrice des droits d'accès
```
ADMIN: Accès complet (lecture/écriture/suppression)
DIRECTEUR: Lecture complète + validation
CHEF_SERVICE: Lecture/Écriture sur son service
MEDECIN: Lecture/Écriture consultations
INFIRMIER: Lecture/Écriture soins
PHARMACIEN: Gestion pharmacie complète
AGENT_ADMIN: Gestion administrative
AGENT_HYGIENE: Checklists hygiene
AGENT: Lecture seule
```

---

## 🚀 Étapes de mise en production

### 1. Créer un compte Supabase
- Aller sur https://supabase.com
- Créer un nouveau projet
- Choisir la région "Paris" (EU-West-3)

### 2. Configurer les tables
- Ouvrir le SQL Editor
- Copier le contenu de `prisma/supabase-schema.sql`
- Exécuter le script

### 3. Configurer les variables d'environnement
```bash
cp .env.supabase .env.local
# Éditer .env.local avec vos clés Supabase
```

### 4. Activer l'authentification
- Dans Supabase: Authentication → Providers
- Activer Email/Password
- Configurer les URLs de redirection

### 5. Configurer le stockage (optionnel)
- Créer un bucket "archives"
- Configurer les politiques d'accès

---

## 📞 Support

Pour toute question sur la configuration:
1. Consulter ce guide
2. Voir la documentation Supabase
3. Contacter l'équipe de développement

---

**EPS Manager v1.0** - Gestion hospitalière pour les EPS de Côte d'Ivoire