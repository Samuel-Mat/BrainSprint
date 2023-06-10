# BrainSprint

## Info
BrainSprint ist eine Webapplikation für die Erstellung und das Teilen von Quiz. Die Quiz können Multiplechoice-, Wahr Falsch- und einfache Schreibfragen beinhalten.
Ebenfalls kann man seine Quiz auf privat stellen, damit sie nicht von anderen Personen gesehen werden. Um die einzelnen Quiz den Usern zuordnen zu können, gibt es ein 
einfaches Login mit Passport. Die Daten der User und Quiz werden in einer MongoDB gespeichert.

## Benutzte Technologien
**IDE** --> Visual Studio Code

**Programmiersprachen** --> JavaScript, EJS, CSS, NodeJS

**NPM-Packages**  --> express, mongoose, routes, bcrypt, passport, flash, session, methodOverride

**Datenbank**  --> MongoDB

## Was habe ich gelernt?

Ich habe bei diesem Projekt viele neue Sachen gelernt. Ich habe gelernt, wie ich eine Datenbank mit meinem Frontend verbinden kann. Ich habe ausserdem
gelernt, wie ein Login funktioniert und wie man dieses in einem Projekt anwendet. Ich habe auch EJS und viele neue NPM-Packages kennengelernt.


## Inbetriebnahme

### Schritt 1
Laden Sie den Code des Programmes herunter. Sie können den Code im Ordner BrainSprintCode finden.

### Schritt 2
Öffnen Sie das Programm mit Visual Studio Code. Danach gehen Sie in ein Terminal und geben den Befehl "npm install" ein. Dieser Befehl macht, dass alle notwendigen NPM Packages automatsich in das Programm geladen werden. Ebenfalls müssen Sie eine .env file in ihrem Programm erstellen. In diesem File legen Sie zwei verschiedene Variablen fest.

DATABASE_URL ---> Beschreibt die URL zu Ihrer MongoDB Datenbank.

SESSION_SECRET ---> Eine abfolge von zufälligen Symbolen, um das Login sicher zu machen.

###  Schritt 3
Wenn alle NPM Packages und das .env File erstellt wurden, können Sie in das Terminal "npm start" eingeben. Danach sollte die Applikation laufen. Sie können die Applikation im Browser unter "localhost:3000" erreichen.

PS: Bei der Registrierung können Sie eine beliebige Email angeben. Sie muss nur ein @ beinhalten.
