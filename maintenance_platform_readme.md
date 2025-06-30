# Plateforme de Gestion de Maintenance
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
## Vue d'ensemble du projet

Cette plateforme numérique centralisée permet de gérer efficacement les interventions de maintenance (préventive, corrective, prédictive), les équipements, les pièces de rechange et fournit des outils d'analyse de performance pour optimiser la maintenance industrielle.

## Stack Technologique

- **Frontend**: React 18+ avec TypeScript
- **Backend**: Python avec FastAPI
- **Base de données**: PostgreSQL hébergée sur Neon
- **Architecture**: Monorepo avec structure modulaire
- **Authentification**: JWT
- **Notifications**: Email + notifications en temps réel

## Architecture Frontend - Pages et Organisation

### 1. Pages d'Authentification

#### Page de Connexion (`/login`)
- Formulaire de connexion avec email/mot de passe
- Liens vers la récupération de mot de passe
- Redirection automatique selon le rôle utilisateur
- Validation des champs en temps réel

#### Page d'Inscription (`/register`)
- Formulaire d'inscription pour nouveaux utilisateurs
- Sélection du rôle (Admin, Technicien, Superviseur)
- Validation des données et confirmation par email
- Redirection vers la page de connexion après inscription

### 2. Tableau de Bord Principal (`/dashboard`)

#### Tableau de Bord Admin
- Vue d'ensemble globale de tous les sites et équipements
- Métriques clés : MTBF, MTTR, disponibilité globale
- Graphiques de performance et tendances
- Alertes critiques et notifications prioritaires
- Raccourcis vers les modules principaux

#### Tableau de Bord Technicien
- Tâches de maintenance assignées pour la journée/semaine
- Équipements sous sa responsabilité
- Historique de ses interventions récentes
- Notifications de nouvelles affectations

#### Tableau de Bord Superviseur
- Vue d'ensemble des équipes et techniciens
- Validation des interventions en attente
- Métriques de performance des équipes
- Planification des ressources

### 3. Module Gestion des Équipements (`/equipments`)

#### Page Liste des Équipements (`/equipments`)
- Tableau filtrable et triable de tous les équipements
- Filtres par site, ligne de production, état, type
- Indicateurs visuels d'état (actif/en panne/en maintenance)
- Actions rapides : voir détails, planifier maintenance, signaler panne

#### Page Détail Équipement (`/equipments/:id`)
- Informations complètes de l'équipement (spécifications, localisation, état)
- Historique complet des maintenances
- Graphiques de performance et disponibilité
- Planning des maintenances futures
- Documents techniques associés (manuels, schémas)

#### Page Ajout/Modification Équipement (`/equipments/new` et `/equipments/:id/edit`)
- Formulaire complet avec tous les champs nécessaires
- Upload de documents et photos
- Affectation à un site/ligne de production
- Configuration des paramètres de maintenance préventive

### 4. Module Planification des Maintenances (`/maintenance`)

#### Page Calendrier des Maintenances (`/maintenance/calendar`)
- Vue calendrier avec toutes les maintenances planifiées
- Vues multiples : jour, semaine, mois
- Drag & drop pour reprogrammer les interventions
- Codes couleur par type de maintenance et urgence
- Filtres par technicien, équipement, site

#### Page Planification (`/maintenance/planning`)
- Interface de création de nouveaux plans de maintenance
- Définition des tâches récurrentes (fréquence, durée)
- Affectation automatique ou manuelle des techniciens
- Gestion des dépendances entre tâches
- Templates de maintenance prédéfinis

#### Page Détail Intervention (`/maintenance/:id`)
- Détails complets de l'intervention planifiée ou réalisée
- Checklist des tâches à effectuer
- Zone de saisie pour le rapport d'intervention
- Gestion des pièces utilisées
- Validation par le superviseur

### 5. Module Interventions Correctives (`/repairs`)

#### Page Signalement de Panne (`/repairs/new`)
- Formulaire de déclaration de panne
- Sélection de l'équipement concerné
- Description détaillée du problème
- Classification de l'urgence
- Upload de photos/vidéos du problème

#### Page Liste des Pannes (`/repairs`)
- Tableau des pannes en cours et résolues
- Filtres par statut, urgence, équipement, technicien
- Indicateurs de temps d'arrêt
- Actions : affecter technicien, voir détails, clôturer

#### Page Fiche d'Intervention (`/repairs/:id/intervention`)
- Formulaire détaillé pour l'intervention corrective
- Diagnostic de la panne et cause racine
- Temps d'intervention et d'arrêt
- Pièces remplacées et coûts
- Photos avant/après réparation

### 6. Module Gestion des Pièces (`/parts`)

#### Page Inventaire (`/parts`)
- Liste complète des pièces en stock
- Niveaux de stock avec alertes de rupture
- Filtres par catégorie, fournisseur, équipement compatible
- Recherche avancée par référence ou description

#### Page Détail Pièce (`/parts/:id`)
- Informations détaillées de la pièce
- Historique des mouvements de stock
- Équipements compatibles
- Fournisseurs et prix
- Prévisions de consommation

#### Page Gestion des Stocks (`/parts/stock-management`)
- Interface pour les entrées/sorties de stock
- Commandes en cours et réceptions
- Gestion des emplacements de stockage
- Alertes de réapprovisionnement

### 7. Module Analyse et Rapports (`/analytics`)

#### Page Tableaux de Bord (`/analytics/dashboards`)
- Graphiques interactifs des KPIs de maintenance
- Métriques par équipement, site, période
- Comparaisons de performance
- Tendances et prévisions

#### Page Rapports (`/analytics/reports`)
- Générateur de rapports personnalisés
- Templates de rapports prédéfinis
- Export en PDF, Excel, CSV
- Programmation d'envois automatiques

### 8. Module Administration (`/admin`)

#### Page Gestion des Utilisateurs (`/admin/users`)
- Liste des utilisateurs avec rôles et permissions
- Interface de création/modification d'utilisateurs
- Gestion des accès par site/équipement
- Historique des connexions

#### Page Configuration Système (`/admin/settings`)
- Paramètres généraux de la plateforme
- Configuration des notifications
- Gestion des templates
- Sauvegarde et restauration

## Architecture Backend - APIs et Services

### 1. Service d'Authentification
- **Endpoints JWT** : login, logout, refresh token, reset password
- **Gestion des rôles** : Admin, Technicien, Superviseur avec permissions granulaires
- **Middleware de sécurité** : validation des tokens, protection des routes
- **Service d'email** : envoi de confirmations et réinitialisations

### 2. Service Gestion des Équipements
- **CRUD équipements** : création, lecture, mise à jour, suppression
- **Gestion des états** : actif, en panne, en maintenance, hors service
- **Service de classification** : types, catégories, sites, lignes de production
- **Upload de fichiers** : gestion des documents et images associés

### 3. Service Planification et Interventions
- **Moteur de planification** : génération automatique des maintenances préventives
- **Gestion des calendriers** : disponibilité des techniciens, conflits de planning
- **Service de notifications** : alertes de maintenance, rappels, escalades
- **Workflow d'intervention** : de la planification à la validation

### 4. Service Gestion des Pannes
- **Système de tickets** : création, affectation, suivi, clôture
- **Classification des pannes** : urgence, type, cause racine
- **Calcul des KPIs** : temps d'arrêt, temps de réparation, disponibilité
- **Historique et traçabilité** : toutes les actions sur une panne

### 5. Service Gestion des Stocks
- **Inventaire temps réel** : mouvements d'entrée/sortie, réservations
- **Système d'alertes** : seuils de réapprovisionnement, ruptures de stock
- **Gestion des fournisseurs** : contacts, prix, délais de livraison
- **Prévisions de consommation** : basées sur l'historique et la planification

### 6. Service Analytics et Reporting
- **Moteur de calcul des KPIs** : MTBF, MTTR, disponibilité, coûts
- **Générateur de rapports** : templates personnalisables, export multi-formats
- **Service de dashboards** : métriques temps réel, graphiques interactifs
- **Système de recommandations** : optimisation de la maintenance préventive

### 7. Service de Notifications
- **Notifications email** : SMTP configuré pour les alertes importantes
- **Notifications temps réel** : WebSocket pour les mises à jour instantanées
- **Système d'escalade** : notifications hiérarchiques selon l'urgence
- **Préférences utilisateur** : personnalisation des types de notifications

### 8. Services Transversaux
- **Service de logs** : audit trail de toutes les actions utilisateurs
- **Service de backup** : sauvegarde automatique des données critiques
- **Service de monitoring** : surveillance de la performance de la plateforme
- **Service d'import/export** : migration de données, intégrations externes

## Base de Données - Structure Principale

### Tables Utilisateurs et Authentification
- **users** : informations utilisateurs, rôles, permissions
- **sessions** : gestion des sessions JWT
- **user_permissions** : permissions granulaires par module

### Tables Équipements
- **equipments** : données principales des équipements
- **equipment_types** : classification et catégorisation
- **sites** : localisation physique des équipements
- **production_lines** : lignes de production et affectations

### Tables Maintenance
- **maintenance_plans** : plans de maintenance préventive
- **maintenance_tasks** : tâches planifiées et réalisées
- **interventions** : détails des interventions (préventives et correctives)
- **maintenance_history** : historique complet des maintenances

### Tables Gestion des Pannes
- **failures** : déclarations de pannes et incidents
- **failure_types** : classification des types de pannes
- **repair_interventions** : interventions correctives détaillées

### Tables Inventaire
- **parts** : catalogue des pièces de rechange
- **stock_movements** : mouvements d'entrée/sortie
- **suppliers** : fournisseurs et informations de contact
- **purchase_orders** : commandes et réceptions

### Tables Analytics
- **kpi_calculations** : calculs des indicateurs de performance
- **reports** : rapports générés et templates
- **dashboard_configs** : configurations des tableaux de bord

## Résultats Attendus

- **Réduction des pannes** par anticipation grâce à la maintenance préventive
- **Traçabilité complète** de toutes les interventions et décisions
- **Prise de décision facilitée** grâce aux indicateurs et analytics
- **Gain de temps et fiabilité** dans la gestion quotidienne de la maintenance
- **Optimisation des coûts** par une meilleure gestion des stocks et ressources