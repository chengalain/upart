# UpArt

Prototype front-end en HTML, CSS et JavaScript modulaire pour une plateforme autour de l'upcycling textile.

## Structure

- `index.html` : structure principale de la page
- `css/main.css` : point d'entrée stylesheet
- `css/base/` : fondations globales, variables et utilitaires
- `css/components/` : navigation et modales
- `css/pages/` : styles par grands écrans ou domaines
- `css/layout/` : styles de structure transverses
- `js/app.js` : point d'entrée de l'application
- `js/core/` : état partagé
- `js/data/` : données mockées
- `js/modules/` : logique métier par fonctionnalité

## Principes appliqués

- plus de CSS ou JS inline dans le HTML
- plus de `onclick` inline
- délégation d'événements centralisée dans `js/app.js`
- séparation entre structure, styles, données et comportements

## Lancer localement

Utiliser un serveur statique local, par exemple :

```bash
python3 -m http.server 4173
```

Puis ouvrir `http://127.0.0.1:4173/index.html`.
