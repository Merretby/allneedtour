# ALLNEEDS Santé — Démonstration indépendante

Projet frontend distinct du site ALLNEEDS. Santé uniquement. Design bleu nuit, bleu électrique, cyan et blanc inspiré du logo fourni.

## Démarrer
Node 22.12+ (24 recommandé).

```powershell
npm install
npm test
npm run build
npm run dev
```

Ouvrir l’adresse affichée par Vite. Choisir le profil directeur, réception ou comptabilité sur l’écran de connexion de démonstration.

## Tester le workflow
1. Entrer avec Sara (réception), ajouter un dossier patient ou un rendez-vous : état À vérifier.
2. Se déconnecter via le bouton en bas du menu, entrer avec le directeur.
3. À vérifier : valider ou demander une correction avec une note.
4. Équipe & accès : créer un collaborateur, choisir ses modules et son droit à modifier ses propres saisies.
5. Copier son lien de démonstration. Ouvrir le lien dans le même navigateur : accès au profil invité.
6. Suspendre le compte : il ne peut plus ouvrir son espace.
7. Consulter le journal et exporter les données autorisées en CSV.
8. Paramètres : réinitialiser la démo.

## Vercel séparé
Créer un nouveau dépôt GitHub pour ce projet et un nouveau projet Vercel.
Framework Vite, commande build `npm run build`, output `dist`, installation `npm install`, Node 24.x. vercel.json inclus pour le rechargement des pages.
Ne pas remplacer le dépôt/site ALLNEEDS principal. Le lien depuis ALLNEEDS sera ajouté après publication de cette plateforme.

## Ce qui fonctionne
Navigation responsive, profils simulés, permissions par module, création/modification de données, vérification par le directeur, filtres/recherche, dashboard calculée, comptes et suspension, invitations locales, historique, export CSV, persistance localStorage.

## Limites de cette première version
Démonstration frontend avec données fictives. Pas d’authentification serveur ni de séparation sécurisée des entreprises, pas d’e-mail envoyé ni de partage des données entre appareils. Les liens d’invitation fonctionnent dans le navigateur contenant les données. Les archives enregistrent le nom du document, sans upload. Le planning est une liste filtrable ; les détails des rendez-vous sont saisis en texte. Paiements : suivi de montants administratifs, sans transaction bancaire. Aucune prise en charge médicale automatisée.

Ne saisir aucune donnée patient réelle. La prochaine étape sera le backend pour comptes, invitations, permissions serveur, audit et documents.

## Vérification
`npm test` vérifie les permissions de modules, comptes suspendus, validation réservée à la direction, auteurs, droits de modification et journal. `npm run build` inclut TypeScript strict et le build Vite.
