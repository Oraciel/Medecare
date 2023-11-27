# Guide d'Installation - Projet Medecare

Ce guide vous fournira les étapes nécessaires pour installer et démarrer le projet Medecare en utilisant Docker.

## Prérequis

Assurez-vous d'avoir installé Docker Desktop sur votre machine avant de commencer. Vous pouvez télécharger Docker Desktop à partir du site officiel : [Docker Desktop](https://www.docker.com/products/docker-desktop)

## Installation et Démarrage

1. Clonez le projet Medecare sur votre machine.

```bash
git clone https://github.com/votre-utilisateur/Medecare.git
cd Medecare
```

2. Ouvrez un terminal et lancez Docker Desktop.

3. Exécutez la commande suivante pour démarrer les containers à partir du fichier `docker-compose.yml` qui se trouve à la racine du projet.

```bash
docker-compose up
```

Cette commande démarrera deux containers :
- Un container avec le serveur Vite sur le port 5173.
- Un container avec le serveur Node.js sur le port 8000.
- Un autre container avec MariaDB sur le port 3306.

4. Une fois les containers démarrés, le script `run-update.sh` sera automatiquement exécuté pour créer les tables et bases de données nécessaires dans la base de données MariaDB.

## Accéder au Projet

Ouvrez votre navigateur web et visitez [http://localhost:5173](http://localhost:5173) pour accéder au projet Medecare.

---

## Architecture de l'Application
L'application repose sur une architecture client-serveur, avec une séparation claire entre le front-end et le back-end. L'ensemble du système communique via des API, utilisant des requêtes POST pour échanger des données entre les différents composants. Voici une description détaillée de chaque composant de l'architecture.

### Composants Principaux

#### 1. Front-end

Le front-end est construit à l'aide de la bibliothèque React, offrant une interface utilisateur interactive et réactive. Il communique avec le back-end via des appels API pour récupérer et afficher les données nécessaires. Les requêtes POST sont utilisées pour envoyer des données au back-end.

#### 2. Back-end

Le back-end est divisé en deux parties distinctes : server.js et capteurs.js.

##### a. server.js

Ce composant gère les connexions avec les clients, gère les formulaires de données et orchestre les différentes opérations du back-end. Il communique avec la base de données MariaDB pour effectuer des opérations de lecture et d'écriture. Les données nécessaires sont récupérées via des appels API.

##### b. capteurs.js

Ce composant est spécifiquement dédié à la gestion des capteurs. Il est responsable de la stratégie d'envoi des données des capteurs vers le serveur. Les données collectées sont ensuite traitées et stockées dans la base de données.

#### 3. Base de données MariaDB

Le back-end communique avec une base de données MariaDB pour stocker et récupérer des données. Les opérations de lecture et d'écriture sont effectuées pour garantir la persistance des informations nécessaires au bon fonctionnement de l'application.

#### 4. Passerelle API

La passerelle API achemine les requêtes et les réponses entre les différents services. Elle assure la communication fluide entre le front-end, les composants du back-end et la base de données.

L'application est configurée pour être déployée à l'aide de Docker Compose, orchestrant plusieurs conteneurs pour les différents composants de l'architecture.

## Fichiers Importants

#### 1. docker-compose.yml

Ce fichier définit la configuration pour Docker Compose et spécifie les services nécessaires à l'application. Il lance deux conteneurs principaux : l'un pour MariaDB sur le port 3306, et l'autre pour les trois serveurs - server.js sur le port 8000, capteurs.js sur le port 8080, et le front-end Vite sur le port 5173.

#### 2. Variables d'environnement .env.development et .env.production

Les fichiers d'environnement contiennent les variables nécessaires pour configurer les composants tels que fetch, cross, et express. Ces variables sont utilisées pour gérer les différentes configurations entre les environnements de développement et de production.

#### 3. run-update.sh

Une fois que la base de données MariaDB est démarrée, le script run-update.sh s'exécute. Ce script est responsable de peupler la base de données en exécutant le fichier update.sql. Cela garantit que la base de données est initialisée avec les données nécessaires au bon fonctionnement de l'application.


# Pipeline CI/CD pour MedEcare

Ce pipeline CI/CD a été mis en place pour automatiser le processus de construction (build), de test, et de déploiement de l'application MedEcare à l'aide de GitLab CI/CD. Il comprend trois étapes principales : `build`, `test`, et `deploy`. Les étapes sont configurées pour s'exécuter de manière automatique dès qu'un changement est poussé sur la branche principale (par défaut, `main`).

## Étapes du Pipeline

### Stage 1 : Build (Construction)

Le premier stage de ce pipeline s'occupe de la construction de l'application en utilisant l'image Docker `node:latest`. Il exécute les étapes suivantes :

1. Change le répertoire de travail vers le répertoire "MedEcare".
2. Installe les dépendances Node.js de l'application en utilisant la commande `npm install`.

### Stage 2 : Test

Le deuxième stage de ce pipeline est dédié à l'exécution des tests de l'application. Il utilise l'image Docker `cypress/base` et exécute les étapes suivantes :

1. Change le répertoire de travail vers le répertoire "MedEcare".
2. Installe les dépendances Node.js de test en utilisant la commande `npm ci`.
3. Exécute les tests de composants de l'application avec la commande `npm run test:component`.

### Stage 3 : Deploy (Déploiement)

Le troisième stage de ce pipeline est dédié au déploiement de l'application. Il utilise l'image Docker `docker:latest` et exécute les étapes suivantes :

1. Configuration SSH :

   - Vérifie si l'agent SSH est installé, sinon l'installe avec `openssh-client`.
   - Démarre l'agent SSH avec la commande `eval $(ssh-agent -s)`.
   - Ajoute la clé SSH privée fournie dans la variable `$SSH_PRIVATE_KEY` à l'agent SSH.
   - Crée le répertoire `~/.ssh` et lui attribue les permissions `700`.
   - Ajoute l'adresse IP de l'hôte distant (172.201.120.198) au fichier `known_hosts` pour éviter les vérifications de clé SSH avec `ssh-keyscan`.
   - Modifie les permissions du fichier `known_hosts` en `644`.

2. Configuration Docker :

   - Change le répertoire de travail vers le répertoire "MedEcare".
   - Connecte Docker au registre Docker Hub avec `docker login`, en utilisant les informations d'identification fournies dans les variables `$DOCKER_USERNAME` et `$DOCKER_PASSWORD`.
   - Construit une image Docker de l'application avec la commande `docker build -t oraciel/medecare:latest .`.
   - Pousse l'image Docker vers Docker Hub avec `docker push oraciel/medecare:latest`.
   - Se déconnecte du registre Docker Hub avec `docker logout`.

3. Exécution de votre code sur la machine virtuelle distante :
   - Se connecte à la machine virtuelle à l'adresse IP 172.201.120.198 via SSH.
   - Exécute `docker-compose up -d` pour démarrer l'application en tant que conteneurs Docker en mode détaché.

## Variables

Assurez-vous de définir correctement les variables suivantes dans les paramètres CI/CD de votre projet GitLab pour que le pipeline fonctionne comme prévu :

- `$SSH_PRIVATE_KEY`: La clé SSH privée utilisée pour l'authentification sur la machine distante.
- `$DOCKER_USERNAME`: Le nom d'utilisateur Docker Hub pour l'authentification.
- `$DOCKER_PASSWORD`: Le mot de passe Docker Hub pour l'authentification.

## Tags et Services

- Le stage de déploiement (`deploy_job`) utilise le tag `dind` pour spécifier où les tâches doivent être exécutées. Dans ce cas, elles seront exécutées sur des hôtes Docker-in-Docker (DinD).
- Le service Docker-in-Docker (`docker:dind`) est utilisé pour exécuter des conteneurs Docker au sein du stage de déploiement.

Ce pipeline GitLab CI/CD automatisé vous permet de construire votre application Node.js, d'exécuter des tests, de créer une image Docker, de la pousser vers Docker Hub, et enfin de la déployer sur une machine virtuelle distante via SSH.

Assurez-vous que les variables et les dépendances nécessaires sont correctement configurées dans votre projet GitLab pour que ce pipeline fonctionne comme prévu.

# Guide de Contribution

Bienvenue dans le guide de contribution pour notre application ! Nous sommes ravis de recevoir des contributions visant à améliorer l'expérience des médecins, des patients et de leurs proches. Voici comment vous pouvez contribuer à chaque espace de l'application :

## Espace Médecin

### Sidebar Triable
Ajoutez une fonctionnalité de tri à la sidebar pour permettre aux médecins de classer les informations en fonction de différents critères, facilitant ainsi l'accès à des données spécifiques.

### Localisation du Malade
Intégrez une fonctionnalité de localisation pour permettre aux médecins de suivre la localisation du patient en temps réel.

### Statistiques
Implémentez des fonctionnalités statistiques pour fournir aux médecins des informations cruciales sur les tendances de santé, les traitements réussis, etc.

### Options
Ajoutez des options supplémentaires pour permettre aux médecins de personnaliser leur expérience, comme le choix du thème, la disposition de l'interface, etc.

## Espace Malade

### Gestion des Traitements
Développez une fonctionnalité de suivi des traitements avec des rappels, des sonneries, et des alertes visuelles pour aider les patients à suivre leur programme de traitement.

### Appels d'Urgence
Intégrez des fonctionnalités permettant aux patients de contacter rapidement les services d'urgence tels que les pompiers, le SAMU, ou leur médecin, avec une page de premiers secours.

### Renseignements
Mettez en place un système complet de renseignements incluant la maladie du patient, les traitements, les normes, et un chatbot alimenté par l'IA pour répondre aux questions courantes.

## Espace Proche

### Gestion des Traitements et Urgences
Dupliquez les fonctionnalités de suivi des traitements et d'appels d'urgence pour les proches, leur permettant de rester informés et de réagir en cas de besoin.

### Structure des Renseignements
Reproduisez la structure de renseignements du côté des proches pour qu'ils puissent accéder rapidement aux informations importantes sur la santé du patient.

## Monitoring avec Prometheus

Nous cherchons également à mettre en place un système de monitoring robuste. Les contributions dans ce domaine incluraient :

### Intégration avec Prometheus
Mettez en place une intégration avec Prometheus pour surveiller les performances de l'application, identifier les problèmes potentiels et garantir une disponibilité maximale.

### Tableaux de Bord
Créez des tableaux de bord informatifs dans Prometheus pour visualiser les métriques clés et permettre une analyse approfondie de l'état du système.

## Comment Contribuer (Suite)

### Guidelines de Contribution

Veuillez suivre ces directives lors de la contribution :

- **Branching**: Créez une branche dédiée pour chaque nouvelle fonctionnalité ou correction de bogue.
- **Documentation**: Assurez-vous de documenter correctement toutes les modifications apportées, y compris les nouvelles fonctionnalités, les API et les configurations.
- **Tests**: Fournissez des tests unitaires et d'intégration pour garantir la stabilité de l'application.
- **Code Review**: Soumettez des demandes de tirage (pull requests) et participez activement au processus de revue de code.
- **Communication**: Communiquez ouvertement avec l'équipe sur les choix d'architecture, les dépendances et les problèmes potentiels.
