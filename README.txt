CONFIGURATEUR 3D LOCLI - MODE D'EMPLOI
-----------------------------------------

1. PRÉPARATION DU MODÈLE :
   - Exportez votre modèle depuis Vectorworks en OBJ.
   - Importez-le dans Blender (gratuit).
   - Exportez-le depuis Blender au format 'glTF Binary (.glb)'.
   - Renommez ce fichier 'module.glb' et placez-le dans ce dossier.

2. LANCEMENT (IMPORTANT) :
   Pour des raisons de sécurité, les navigateurs bloquent le chargement de fichiers 3D en ouvrant simplement le fichier HTML.
   Vous devez utiliser un petit serveur local :
   - OPTION A (Simple) : Utilisez l'extension "Live Server" dans Visual Studio Code.
   - OPTION B : Si vous avez Python installé, ouvrez un terminal dans ce dossier et tapez : 
     python -m http.server 8000
     Ensuite, allez sur http://localhost:8000 dans votre navigateur.

3. PERSONNALISATION :
   - Dans 'main.js', vous pouvez modifier la fonction 'toggleVisibility' pour masquer des éléments spécifiques 
     (ex: murs, fenêtres) en utilisant les noms que vous avez donnés dans Vectorworks.
