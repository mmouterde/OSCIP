# OSCIP

OpenSourceContinuousIntegrationPlatform

Je reviens à l'idée de faire une PIC opensource à héberger, ca me plait bien.
J'ai coucher dans ce mail quelques une des idées énoncés sur le rôle strict d'une PIC
 (exit donc le cron, le dashboard lanceur de shell, et aussi sonar. ils seront dans un autre périmètre fonctionnel ?!)

Je prend pour exemple le pipeline de bibucket (encore en béta) qui lance des steps décritent en yml dans un environnement de docker lié aux branches d'un git

J'ai plein d'attente mais je me concentre sur la version minimaliste qui me pousserait moi à installer un PIC et me passer de jenkins.

Sur un front :
- créér un projet en renseignant :
- une URL vers un dockerFile
- une URL d'un repot Git (pour le cloner/scruter)

Back :
- scruter le repo git (juste un bouton pour le mvp)
- lancer un docker en s'appuyant sur le dockerfile (en supposant qu'il y a tout dedans pour le build (git clone + build step script)
- recupérer les logs & artifacts

Front:
- Afficher un rapport du build OK/KO

Ce qui manquera vraiment : 
- historique des builds/branche/run
- récuperer les rapports des TU, coverage et en faire afficher/historiser


Idée ensuite : 
- condition sur le déclenchement (ex : si nouveau  package.json.version) 
- proposer des dockers file type (ex : npm install + npm run test)
- mounter un volume pour que la tache docker y copie tous ce qui sera "archivé" dans le job (xunit, lcov, articact.tar.gz)
- récupérer les logs sysout/syserr

cf les retours de la béta de pipeline pour inspirer : https://bitbucket.org/site/master/issues?status=new&status=open&component=Pipelines&page=2

Qu'en pensez vous ?
