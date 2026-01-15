# 🚀 Feuille de route EPS Manager

## Phase 1: Fondations (Complété)
- [x] Architecture Next.js 14 + TypeScript
- [x] Base de données Supabase
- [x] Dashboard principal
- [x] Module RH de base

---

## Phase 2: Modules Opérationnels (Priorité haute)

### 2.1 Pharmacie - Gestion des stocks
```
Fonctionnalités:
- [ ] Inventaire en temps réel
- [ ] Alertes automatiques de rupture
- [ ] Suivi des dates de péremption
- [ ] Bons de commande automatiques
- [ ] Historique des mouvements
- [ ] Catégorisation (Médicaments, Consommables, Réactifs)

Écran principal:
- Liste produits avec colorations (vert/jaune/rouge)
- Barre de recherche rapide
- Filtres par catégorie
- Statistiques: total stock, valeur, alertes
```

### 2.2 Finance - PBF & Comptabilité
```
Fonctionnalités:
- [ ] Saisie des réalisations PBF
- [ ] Calcul automatique des montants
- [ ] Validation hiérarchique (Chef service → Directeur)
- [ ] Rapports mensuels
- [ ] Suivi des recettes/dépenses
- [ ] Tableaux de bord financiers

Indicateurs PBF clés:
- Consultations curatives
- CPN (Consultations prénatales)
- Accouchements
- Vaccinations
- Prise en charge enfants < 5 ans
```

### 2.3 Hygiène - Contrôle qualité
```
Fonctionnalités:
- [ ] Checklists numériques par zone
- [ ] Photos avant/après
- [ ] Scores automatisés
- [ ] Alertes non-conformités
- [ ] Historique des contrôles
- [ ] Rapports d'audit

Zones de contrôle:
- Salles de consultation
- Laboratoire
- Bloc opératoire
- Pharmacie
- Couloirs et communs
- Cuisine/Restauration
```

---

## Phase 3: Planification & Organisation

### 3.1 Congés
```
Workflow:
1. Agent fait sa demande
2. Chef service valide/rejette
3. Directeur valide définitivement
4. Notification automatique

Features:
- Calendrier des absences
- Solde de congés
- Planning prévisionnel
```

### 3.2 Gardes
```
Fonctionnalités:
- [ ] Planning mensuel
- [ ] Attribution automatique
- [ ] Suivi des heures supplémentaires
- [ ] Appels d'urgence
- [ ] Tableau de garde affichable
```

---

## Phase 4: Communication & Coordination

### 4.1 Annuaire
```
Contacts par service:
- Direction
- Médecins
- Infirmiers/ères
- Pharmacie
- Administration
- Services externes (SAMU, etc.)

Features:
- Recherche rapide
- Numéros d'urgence
- Heures de garde
```

### 4.2 Notifications
```
Types:
- Alertes stock bas
- Demandes de congés en attente
- Rapports PBF à valider
- Contrôles hygiène en retard
- Anniversaires du personnel
```

---

## Phase 5: Rapports & Analyses

### 5.1 Tableaux de bord
```
Dashboard exécutif:
- Indicateurs clés (KPIs)
- Comparaisons mensuelles
- Tendances

Dashboard opérationnel:
- Activité quotidienne
- Alertes actives
- Tâches en cours
```

### 5.2 Exports
```
Formats disponibles:
- PDF (Rapports officiels)
- Excel (Tableaux de données)
- CSV (Import/export)
```

---

## Phase 6: Mobile & Accessibilité

### 6.1 Application mobile
```
Features prioritaires:
- Consultation rapide du planning
- Notifications push
- Saisie hors ligne
- Scanner de médicaments
```

### 6.2 Accessibilité
```
Pour tous les utilisateurs:
- Interface simplifiée
- Gros boutons
- Contraste élevé
- Mode hors ligne
```

---

## 🎯 Priorités pour la Phase 2

| Module | Impact | Difficulté | Priorité |
|--------|--------|------------|----------|
| Pharmacie | ★★★★★ | ★★☆☆☆ | 1 |
| Finance PBF | ★★★★★ | ★★★☆☆ | 2 |
| Hygiène | ★★★★☆ | ★★☆☆☆ | 3 |
| Congés | ★★★★☆ | ★★★☆☆ | 4 |
| Gardes | ★★★☆☆ | ★★☆☆☆ | 5 |

---

## 👥 Rôles des utilisateurs

| Rôle | Permissions |
|------|-------------|
| **Directeur** | Validation finale, rapports, configuration |
| **Chef Service** | Validation service, rapports service |
| **Médecin** | Consultations, planning, alerts |
| **Infirmier/ère** | Soins, planning, checklists |
| **Pharmacien** | Gestion pharmacie complète |
| **Agent Admin** | Saisie, rapports, archives |
| **Agent Hygiene** | Checklists, rapports |

---

## 📋 Prochaine réunion de travail

**Sujets à couvrir:**
1. Validation de la liste des indicateurs PBF
2. Définition des catégories de médicaments
3. Zones d'hygiène prioritaires
4. Structure organisationnelle du centre
5. Planning des formations utilisateur

---

**EPS Manager v1.0** - En développement