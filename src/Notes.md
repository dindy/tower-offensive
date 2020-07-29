# Notes

## Les possibilités avec le zoom en CSS (propriété transform)

1. **Le zoom classique**

La taille de l'image correspond à celle de la zone de visualisation.

* (+) Déjà implémenté
* (+) Optimise les performances (le canvas calculé est de 500px)
* (-) Pixellisation lors du zoom

| Zoom | Factor | Taille | Visible |
|---|---|---|---|
|    3 |      2 |   1000 |     500 |
|    2 |    1.5 |    750 |     500 |
|    1 |      1 |    500 |     500 |

2. **Le dézoom par défaut**

L'image est plus grande que la zone de visualisation. Elle est dézoomée par défaut.

* (+) Au niveau max le zoom affiche le canvas dans sa résolution d'origine (pas de perte de qualité).
* (-) La résolution du canvas calculé est plus grande que nécessaire avec le (de)zoom par défaut


| Zoom | Factor | Taille | Visible |
|---|---|---|---|
|   3 |      1 |   1000 |     500 |
|   2 |   0.75 |    750 |     500 |
|   1 |    0.5 |    500 |     500 |

3. **Une solution intermédiaire**

| Zoom | Factor | Taille | Visible |
|---|---|---|---|
|    3 |   1.33 |   1000 |     500 |
|    2 |      1 |    750 |     500 | 
|    1 |   0.66 |    500 |     500 |

*Notes :*
* Avec scale, l'image de background n'est pas pixellisée lors du zoom si sa taille est plus grande que sa taille affichée (elle est dézoomée par défaut).
* Avec scale, l'image du canvas est pixellisée même si on imprime des images en-dessous de leur vraie résolution. 
* Il est possible de modifier le lissage appliqué par les transformations CSS sur le canvas :
```css        
    image-rendering: -moz-crisp-edges;    
    image-rendering: -webkit-crisp-edges; 
    image-rendering: pixelated;             
```        
        

*Liens :*
* [Conseils sur les performances](https://developer.mozilla.org/fr/docs/Tutoriel_canvas/Optimizing_canvas)
* [How to scale a canvas](https://devlog.disco.zone/2016/07/22/canvas-scaling/)
* [Improving HTML5 Canvas Performance](https://www.html5rocks.com/en/tutorials/canvas/performance/)