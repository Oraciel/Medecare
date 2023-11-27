CREATE DATABASE IF NOT EXISTS medecare;

USE medecare;

CREATE TABLE
    IF NOT EXISTS Maladies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        maladie VARCHAR(255) NOT NULL,
        categorie VARCHAR(255) NOT NULL,
        symptomes JSON NOT NULL,
        premieres_mesures JSON NOT NULL
    );

INSERT
    IGNORE INTO Maladies (
        maladie,
        categorie,
        symptomes,
        premieres_mesures
    )
VALUES (
        'Grippe',
        'respiratoires',
        '["Fièvre", "Toux", "Fatigue"]',
        '["Repos au lit", "Hydratation", "Antiviraux"]'
    ), (
        'Rhume',
        'respiratoires',
        '["Éternuements", "Nez qui coule", "Mal de gorge"]',
        '["Repos", "Hydratation", "Décongestionnants"]'
    ), (
        'Angine',
        'respiratoires',
        '["Mal de gorge", "Difficulté à avaler", "Fièvre"]',
        '["Antibiotiques", "Gargarisme", "Repos"]'
    ), (
        'Bronchite',
        'respiratoires',
        '["Toux persistante", "Essoufflement", "Maux de poitrine"]',
        '["Antibiotiques", "Inhalateurs", "Repos"]'
    ), (
        'Sinusite',
        'respiratoires',
        '["Douleur faciale", "Congestion nasale", "Mal de tête"]',
        '["Décongestionnants", "Antibiotiques", "Hydratation"]'
    ), (
        'Migraine',
        'faciauxCephaliques',
        '["Pulsations douloureuses", "Photophobie", "Nausées"]',
        '["Repos dans une pièce sombre", "Analgésiques", "Hydratation"]'
    ), (
        'Diabète de type 2',
        'endocriniens',
        '["Soif excessive", "Fatigue", "Polyurie"]',
        '["Contrôle de la glycémie", "Régime alimentaire", "Exercice régulier"]'
    ), (
        'Asthme',
        'respiratoires',
        '["Essoufflement", "Toux sèche", "Sifflements respiratoires"]',
        '["Inhalateurs", "Éviter les déclencheurs", "Suivi médical régulier"]'
    ), (
        'Hypertension artérielle',
        'cardiovasculaires',
        '["Maux de tête", "Fatigue", "Vertiges"]',
        '["Médicaments antihypertenseurs", "Régime faible en sel", "Exercice physique"]'
    ), (
        'Polyarthrite rhumatoïde',
        'articulairesMusculaires',
        '["Raideur articulaire", "Douleur", "Gonflement des articulations"]',
        '["Médicaments anti-inflammatoires", "Physiothérapie", "Exercices doux"]'
    ), (
        'Maladie cœliaque',
        'digestifs',
        '["Douleurs abdominales", "Diarrhée", "Fatigue"]',
        '["Régime sans gluten", "Suppléments nutritionnels", "Suivi médical"]'
    ), (
        'Maladie de Parkinson',
        'neurologiques',
        '["Tremblements", "Raideur musculaire", "Troubles de l''équilibre"]',
        '["Médicaments antiparkinsoniens", "Thérapie physique", "Support psychologique"]'
    ), (
        'Fibromyalgie',
        'articulairesMusculaires',
        '["Douleurs musculaires", "Fatigue", "Troubles du sommeil"]',
        '["Exercices doux", "Thérapie cognitivo-comportementale", "Gestion du stress"]'
    ), (
        'Cancer du sein',
        'cancer',
        '["Formation d''une masse", "Changements dans la forme du sein", "Douleur"]',
        '["Mammographie", "Biopsie", "Traitement personnalisé"]'
    ), (
        'Maladie d''Alzheimer',
        'neurologiques',
        '["Perte de mémoire", "Confusion", "Difficulté à accomplir des tâches familières"]',
        '["Évaluation médicale approfondie", "Traitement symptomatique", "Soutien familial"]'
    ), (
        'Anémie',
        'poidsAppetit',
        '["Fatigue", "Pâleur de la peau", "Essoufflement"]',
        '["Suppléments de fer", "Alimentation riche en fer", "Traitement de la cause sous-jacente"]'
    ), (
        'Maladie de Crohn',
        'digestifs',
        '["Douleurs abdominales", "Diarrhée", "Perte de poids"]',
        '["Médicaments anti-inflammatoires", "Régime spécifique", "Chirurgie dans certains cas"]'
    ), (
        'Endométriose',
        'gynecologiques',
        '["Douleurs pelviennes", "Douleurs pendant les rapports sexuels", "Menstruations douloureuses"]',
        '["Médicaments pour soulager la douleur", "Chirurgie dans certains cas", "Traitement hormonal"]'
    ), (
        'Maladie de Lyme',
        'infectieuses',
        '["Éruption cutanée en forme de cible", "Fatigue", "Douleurs musculaires et articulaires"]',
        '["Antibiotiques", "Repos", "Contrôle régulier"]'
    ), (
        'Ostéoporose',
        'articulairesMusculaires',
        '["Fractures fréquentes", "Perte de taille", "Douleurs dorsales"]',
        '["Suppléments de calcium et de vitamine D", "Médicaments pour renforcer les os", "Exercice physique régulier"]'
    ), (
        'Sclérose en plaques',
        'neurologiques',
        '["Engourdissement", "Faiblesse musculaire", "Problèmes de coordination"]',
        '["Médicaments modificateurs de la maladie", "Thérapie physique", "Soutien psychologique"]'
    ), (
        'Spondylarthrite ankylosante',
        'articulairesMusculaires',
        '["Douleur au bas du dos", "Raideur matinale", "Fatigue"]',
        '["Médicaments anti-inflammatoires", "Exercices physiques", "Thérapie physique"]'
    ), (
        'Thyroïdite de Hashimoto',
        'endocriniens',
        '["Fatigue", "Gain de poids", "Sensibilité au froid"]',
        '["Thyroïdiens substitutifs", "Suivi médical régulier", "Régime équilibré"]'
    ), (
        'Tuberculose',
        'respiratoires',
        '["Toux persistante", "Fièvre", "Perte de poids"]',
        '["Antibiotiques", "Isolement", "Suivi médical étroit"]'
    ), (
        'Maladie de Raynaud',
        'vasculaires',
        '["Doigts et orteils froids", "Changements de couleur de la peau", "Engourdissement"]',
        '["Protection contre le froid", "Médicaments vasodilatateurs", "Arrêt du tabac"]'
    ), (
        'Glaucome',
        'visuels',
        '["Vision floue", "Mal de tête", "Halos autour des lumières"]',
        '["Collyre pour abaisser la pression intraoculaire", "Chirurgie dans certains cas", "Suivi ophtalmologique régulier"]'
    ), (
        'Hépatite B',
        'infectieuses',
        '["Jaunisse", "Fatigue", "Douleurs abdominales"]',
        '["Vaccination", "Médicaments antiviraux", "Suivi médical régulier"]'
    ), (
        'Insuffisance cardiaque',
        'cardiovasculaires',
        '["Essoufflement", "Fatigue", "Œdème des jambes"]',
        '["Médicaments", "Régime faible en sel", "Exercice physique adapté"]'
    ), (
        'Lupus érythémateux disséminé',
        'autoimmunes',
        '["Éruption cutanée", "Fatigue", "Douleurs articulaires"]',
        '["Médicaments immunosuppresseurs", "Protection solaire", "Suivi médical régulier"]'
    ), (
        'Maladie d''Addison',
        'endocriniens',
        '["Fatigue", "Perte de poids", "Hypotension artérielle"]',
        '["Hormones de remplacement", "Régime alimentaire équilibré", "Suivi endocrinologique"]'
    ), (
        'Myasthénie grave',
        'neurologiques',
        '["Faiblesse musculaire", "Fatigue", "Difficulté à parler et à manger"]',
        '["Médicaments immunosuppresseurs", "Thérapie physique", "Suivi neurologique régulier"]'
    ), (
        'Psoriasis',
        'cutanes',
        '["Plaques rouges et squameuses sur la peau", "Démangeaisons", "Inflammation"]',
        '["Crèmes topiques", "Exposition modérée au soleil", "Traitement systémique dans certains cas"]'
    ), (
        'Sclérose latérale amyotrophique (SLA)',
        'neurologiques',
        '["Faiblesse musculaire", "Difficulté à parler et à déglutir", "Spasticité"]',
        '["Soutien symptomatique", "Appareils d''assistance", "Suivi médical étroit"]'
    ), (
        'Trouble bipolaire',
        'moodPsychologiques',
        '["Épisodes de manie et de dépression", "Altération du sommeil", "Irritabilité"]',
        '["Médicaments stabilisateurs de l''humeur", "Thérapie cognitivo-comportementale", "Suivi psychiatrique régulier"]'
    ), (
        'Dépression',
        'moodPsychologiques',
        '["Tristesse persistante", "Perte d''intérêt", "Troubles du sommeil"]',
        '["Thérapie", "Médicaments antidépresseurs", "Soutien psychologique"]'
    ), (
        'Trouble obsessionnel-compulsif (TOC)',
        'moodPsychologiques',
        '["Obsessions intrusives", "Compulsions répétitives", "Anxiété"]',
        '["Thérapie cognitivo-comportementale", "Médicaments anxiolytiques", "Soutien psychiatrique"]'
    ), (
        'Trouble de l''anxiété généralisée (TAG)',
        'moodPsychologiques',
        '["Inquiétude excessive", "Fatigue", "Troubles du sommeil"]',
        '["Thérapie cognitivo-comportementale", "Médicaments anxiolytiques", "Gestion du stress"]'
    ), (
        'Schizophrénie',
        'neurologiques',
        '["Hallucinations", "Délires", "Troubles de la pensée"]',
        '["Médicaments antipsychotiques", "Thérapie individuelle", "Soutien social"]'
    ), (
        'Trouble du spectre de l''autisme (TSA)',
        'neurologiques',
        '["Difficultés dans la communication", "Comportements répétitifs", "Sensibilité sensorielle"]',
        '["Interventions éducatives spécialisées", "Thérapie comportementale", "Soutien familial"]'
    );

CREATE TABLE
    IF not EXISTS Utilisateurs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255),
        prenom VARCHAR(255),
        type_utilisateur ENUM('Medecin', 'Malade', 'Proche'),
        date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF not EXISTS Malades (
        id INT AUTO_INCREMENT PRIMARY KEY,
        utilisateur_id INT,
        numero_carte_vitale VARCHAR(255),
        adresse VARCHAR(255),
        date_naissance DATE,
        genre ENUM('Homme', 'Femme', 'Autre'),
        maladies_patient TEXT,
        medecin_traitant INT,
        FOREIGN KEY (utilisateur_id) REFERENCES Utilisateurs(id)
    );

CREATE TABLE
    IF not EXISTS Proches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        utilisateur_id INT,
        nom_proche VARCHAR(255),
        numero_carte_vitale_proche VARCHAR(255),
        lien VARCHAR(255),
        FOREIGN KEY (utilisateur_id) REFERENCES Utilisateurs(id)
    );

CREATE TABLE
    IF not EXISTS Medecins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        utilisateur_id INT,
        numero_medecin VARCHAR(255),
        adresse_professionnelle VARCHAR(255),
        specialite VARCHAR(255),
        mot_de_passe VARCHAR(255),
        malades_pris_en_charge TEXT,
        FOREIGN KEY (utilisateur_id) REFERENCES Utilisateurs(id)
    );

CREATE TABLE
    IF not EXISTS Capteurs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        utilisateur_id INT,
        battements_coeur VARCHAR(255),
        coeur_etat VARCHAR(255),
        coeur_danger VARCHAR(255),
        glucose VARCHAR(255),
        glucose_etat VARCHAR(255),
        glucose_danger VARCHAR(255),
        temperature VARCHAR(255),
        temperature_etat VARCHAR(255),
        temperature_danger VARCHAR(255),
        pression_sanguine VARCHAR(255),
        pression_etat VARCHAR(255),
        pression_danger VARCHAR(255),
        acceleration VARCHAR(255),
        acceleration_etat VARCHAR(255),
        acceleration_danger VARCHAR(255),
        derniere_maj VARCHAR(255),
        FOREIGN KEY (utilisateur_id) REFERENCES Utilisateurs(id)
    );

CREATE TABLE
    IF not EXISTS HistoriqueMalade (
        id INT AUTO_INCREMENT PRIMARY KEY,
        utilisateur_id INT,
        battements_coeur VARCHAR(255),
        coeur_danger VARCHAR(255),
        glucose VARCHAR(255),
        glucose_danger VARCHAR(255),
        temperature VARCHAR(255),
        temperature_danger VARCHAR(255),
        pression_sanguine VARCHAR(255),
        pression_danger VARCHAR(255),
        date_maj VARCHAR(255),
        FOREIGN KEY (utilisateur_id) REFERENCES Utilisateurs(id)
    );