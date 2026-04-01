# HBnB - Part 4

## Objectif
Part 4 consolide le projet HBnB avec une architecture separee:
- backend API (Flask)
- frontend Vanilla JS (v0)
- frontend React (version evolutive)

## Evolution du frontend

### v0: Frontend Vanilla
La version initiale en Vanilla JavaScript a servi a:
- comprendre le cycle complet login -> appel API -> rendu HTML
- valider les routes backend et la gestion des tokens JWT
- poser les bases des interactions (liste des logements, details, avis)

Cette etape est ideale pour maitriser le fonctionnement brut du projet sans abstraction.

### Passage a React
Le basculement vers React a ete fait pour gagner en:
- scalabilite: composants reutilisables et structure modulaire
- maintenabilite: separation claire pages, composants, contextes, utilitaires
- performance percue: rendu reactif, etat local/global mieux organise
- experience utilisateur: interface plus fluide, feedbacks UI (toast, loading, erreurs)

## Modifications principales apportees
- Auth centralisee avec contexte React (token, utilisateur courant, roles).
- Navigation protegee (routes privees et admin).
- Panel administrateur complet (CRUD utilisateurs, logements, equipements, avis).
- Restriction d acces admin pour la documentation API/Swagger cote backend.
- Refonte UI progressive avec Tailwind:
  - systeme de design tokens (couleurs, composants utilitaires)
  - cartes, formulaires, boutons et layouts harmonises
  - travail mobile-first et accessibilite (focus, labels, navigation clavier)
- Gestion UX des avis deja publies sur un logement:
  - si un utilisateur connecte a deja laisse un avis, le front n affiche plus le CTA "Ajouter un avis"
  - un message explicite est affiche a la place pour expliquer pourquoi une seconde publication est bloquee
- Amelioration de l affichage des logements dans l admin:
  - affichage du proprietaire en Prenom Nom a la place de l ID brut.

## Structure rapide
- backend/: API Flask, models, services, persistance SQL
- frontend/: version v0 en Vanilla JS
- frontend-react/: application React + Tailwind (version cible)

## Pourquoi garder les deux frontends
Conserver v0 (Vanilla) et React permet:
- de comparer l implementation brute et l implementation modulaire
- d utiliser Vanilla comme reference pedagogique
- de faire evoluer React sans perdre la comprehension fonctionnelle de base

## Lancement (rappel)
- Backend: lancer Flask dans part4/backend
- React: lancer Vite dans part4/frontend-react
- Vanilla: ouvrir/servir part4/frontend selon votre setup
