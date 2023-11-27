import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Convertit import.meta.url en un chemin de fichier
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supposant que server.js est dans le dossier backend
const envFileName = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
const envPath = path.resolve(__dirname, `../${envFileName}`);
dotenv.config({ path: envPath });

// Configuration de la clé secrète pour le JWT
const secretKey = crypto.randomBytes(32).toString('hex');

// Configuration du serveur Express
const app = express();
const portBd = process.env.PORTBd;
const port = process.env.PORTServer;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Configuration CORS pour les routes
const corsOptions = {
    origin: process.env.API_URL_SERVVITE,
};

app.use(cors(corsOptions));
app.use(express.json());

// Configuration de la connexion à la base de données
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: portBd,
});

console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_DATABASE);
console.log(portBd);

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données : ' + err.stack);
        return;
    }
    console.log(`Connecté à la base de données MySQL ${portBd}`);
});

// Route de traitement du formulaire d'inscription pour les malades
app.post('/register_malade', (req, res) => {
    const { nom, prenom, numero_carte_vitale, adresse, date_naissance, genre, medecin_traitant } = req.body;

    // Vérification si l'utilisateur existe déjà
    const checkUserQuery = 'SELECT * FROM Malades WHERE numero_carte_vitale = ?';
    db.query(checkUserQuery, [numero_carte_vitale], (checkErr, existingUser) => {
        if (checkErr) {
            console.error('Erreur lors de la vérification de l\'utilisateur : ' + checkErr.stack);
            res.status(500).json({ message: 'Erreur lors de l\'inscription' });
        } else {
            if (existingUser.length > 0) {
                // L'utilisateur existe déjà
                res.status(409).json({ message: 'L\'utilisateur existe déjà' });
            } else {
                // Vérification si le medecin_traitant existe
                const checkMedecinQuery = 'SELECT * FROM Medecins WHERE numero_medecin = ?';
                db.query(checkMedecinQuery, [medecin_traitant], (checkMedecinErr, existingMedecin) => {
                    if (checkMedecinErr) {
                        console.error('Erreur lors de la vérification du médecin : ' + checkMedecinErr.stack);
                        res.status(500).json({ message: 'Erreur lors de l\'inscription' });
                    } else {
                        if (existingMedecin.length > 0) {
                            // Le médecin existe déjà, procéder à l'inscription du malade
                            const type_utilisateur = 'Malade';
                            const insertUserQuery = 'INSERT INTO Utilisateurs (nom, prenom, type_utilisateur) VALUES (?, ?, ?)';
                            db.query(insertUserQuery, [nom, prenom, type_utilisateur], (insertErr, result) => {
                                if (insertErr) {
                                    console.error('Erreur lors de l\'insertion dans la base de données : ' + insertErr.stack);
                                    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
                                } else {
                                    const userId = result.insertId;
                                    const medecinTraitantId = existingMedecin[0].id;

                                    const insertMaladeQuery = 'INSERT INTO Malades (utilisateur_id, numero_carte_vitale, adresse, date_naissance, genre, medecin_traitant) VALUES (?, ?, ?, ?, ?, ?)';
                                    db.query(insertMaladeQuery, [userId, numero_carte_vitale, adresse, date_naissance, genre, medecin_traitant], (maladeErr) => {
                                        if (maladeErr) {
                                            console.error('Erreur lors de l\'inscription du malade : ' + maladeErr.stack);
                                            res.status(500).json({ message: 'Erreur lors de l\'inscription' });
                                        } else {
                                            // Ajout du malade à la liste des malades pris en charge par le médecin
                                            const updateMedecinQuery = 'UPDATE Medecins SET malades_pris_en_charge = CONCAT_WS(", ", malades_pris_en_charge, ?) WHERE id = ?';
                                            db.query(updateMedecinQuery, [userId, medecinTraitantId], (updateErr) => {
                                                if (updateErr) {
                                                    console.error('Erreur lors de l\'ajout du malade à la liste des malades pris en charge : ' + updateErr.stack);
                                                    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
                                                } else {
                                                    res.status(200).json({ message: 'Inscription réussie en tant que malade' });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            // Le médecin n'existe pas
                            res.status(404).json({ message: 'Le médecin n\'existe pas' });
                        }
                    }
                });
            }
        }
    });
});



// Route de traitement du formulaire d'inscription pour les proches
app.post('/register_medecin', (req, res) => {
    const {
        nom,
        prenom,
        numero_medecin,
        adresse_professionnelle,
        specialite,
        mot_de_passe,
    } = req.body;


    // Vérification si le médecin existe déjà
    const checkMedecinQuery = 'SELECT * FROM Medecins WHERE numero_medecin = ?';
    db.query(checkMedecinQuery, [numero_medecin], (checkErr, existingMedecin) => {
        if (checkErr) {
            console.error('Erreur lors de la vérification du médecin : ' + checkErr.stack);
            res.status(500).json({ message: 'Erreur lors de l\'inscription' });
        } else {
            if (existingMedecin.length > 0) {
                // Le médecin existe déjà
                res.status(409).json({ message: 'Le médecin existe déjà' });
            } else {
                // Le médecin n'existe pas, procéder à l'inscription
                const type_utilisateur = 'Medecin';
                const insertUserQuery = 'INSERT INTO Utilisateurs (nom, prenom , type_utilisateur) VALUES (?, ?, ?)';
                db.query(
                    insertUserQuery,
                    [nom, prenom, type_utilisateur],
                    (userInsertErr, userResult) => {
                        if (userInsertErr) {
                            console.error('Erreur lors de l\'inscription de l\'utilisateur : ' + userInsertErr.stack);
                            res.status(500).json({ message: 'Erreur lors de l\'inscription' });
                        } else {
                            const userId = userResult.insertId;
                            const insertMedecinQuery = 'INSERT INTO Medecins (utilisateur_id, numero_medecin, adresse_professionnelle, specialite, mot_de_passe) VALUES (?, ?, ?, ?, ?)';
                            db.query(
                                insertMedecinQuery,
                                [userId, numero_medecin, adresse_professionnelle, specialite, mot_de_passe],
                                (medecinInsertErr) => {
                                    if (medecinInsertErr) {
                                        console.error('Erreur lors de l\'inscription du médecin : ' + medecinInsertErr.stack);
                                        res.status(500).json({ message: 'Erreur lors de l\'inscription' });
                                    } else {
                                        res.status(200).json({ message: 'Inscription réussie en tant que médecin' });
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    });
});

// Route de traitement du formulaire d'inscription pour les proches
app.post('/register_proche', (req, res) => {
    const { nom_proche, numero_carte_vitale_proche, nom, prenom, lien } = req.body;

    // Vérification si l'utilisateur existe déjà
    const checkUserQuery = 'SELECT * FROM Utilisateurs WHERE nom = ? AND prenom = ?';
    db.query(checkUserQuery, [nom, prenom], (checkErr, existingUser) => {
        if (checkErr) {
            console.error('Erreur lors de la vérification de l\'utilisateur : ' + checkErr.stack);
            res.status(500).json({ message: 'Erreur lors de l\'inscription' });
        } else {
            if (existingUser.length > 0) {
                // L'utilisateur existe déjà
                res.status(409).json({ message: 'L\'utilisateur existe déjà' });
            } else {
                // L'utilisateur n'existe pas, procéder à l'inscription
                const type_utilisateur = 'Proche';
                const insertUserQuery = 'INSERT INTO Utilisateurs (nom, prenom, type_utilisateur) VALUES (?, ?, ?)';
                db.query(insertUserQuery, [nom, prenom, type_utilisateur], (insertErr, result) => {
                    if (insertErr) {
                        console.error('Erreur lors de l\'insertion dans la base de données : ' + insertErr.stack);
                        res.status(500).json({ message: 'Erreur lors de l\'inscription' });
                    } else {
                        const userId = result.insertId;
                        const insertProcheQuery = 'INSERT INTO Proches (utilisateur_id, nom_proche, numero_carte_vitale_proche, lien) VALUES (?, ?, ?, ?)';
                        db.query(insertProcheQuery, [userId, nom_proche, numero_carte_vitale_proche, lien], (procheErr) => {
                            if (procheErr) {
                                console.error('Erreur lors de l\'inscription du proche : ' + procheErr.stack);
                                res.status(500).json({ message: 'Erreur lors de l\'inscription' });
                            } else {
                                res.status(200).json({ message: 'Inscription réussie en tant que proche' });
                            }
                        });
                    }
                });
            }
        }
    });
});

// Route de traitement du formulaire de connexion pour les malades
app.post('/login_malade', (req, res) => {
    const { cardNumber, nom } = req.body;

    const checkUserQuery = 'SELECT * FROM Malades m JOIN Utilisateurs u ON m.utilisateur_id = u.id WHERE m.numero_carte_vitale = ? AND u.nom = ?;';
    db.query(checkUserQuery, [cardNumber, nom], (checkErr, existingUser) => {
        if (checkErr) {
            console.error('Erreur 500 : Erreur lors de la connexion:', checkErr);
            res.status(500).json({ message: 'Erreur 500 : Erreur lors de la connexion' });
        } else {
            if (existingUser.length > 0) {
                // On génère un token JWT pour l'utilisateur
                const token = jwt.sign({ userId: existingUser[0].id, idMalade: existingUser[0].utilisateur_id }, secretKey, { expiresIn: '1h' });

                // L'utilisateur existe, on considère la connexion comme réussie et on renvoie le token
                res.status(200).json({ message: 'Connexion Reussi', token, idMalade: existingUser[0].utilisateur_id });
            } else {
                // L'utilisateur n'existe pas ou le numéro de carte vitale n'est pas valide
                res.status(401).json({ message: 'Erreur 401 : numéro de carte vitale non valide' });
            }
        }
    });
});

// Route de traitement du formulaire de connexion pour les proches
app.post('/login_proche', (req, res) => {
    const { nom_proche, numero_carte_vitale_proche } = req.body;

    // Vérification sur le numéro de carte vitale, le nom du proche et qu'il sagit bien d'un compte utilisateur proche
    const checkUserQuery = `SELECT * 
    FROM Proches p 
    JOIN Utilisateurs u ON p.utilisateur_id = u.id 
    WHERE p.nom_proche = ? 
    AND p.numero_carte_vitale_proche = ?
    AND u.type_utilisateur LIKE "Proche"
    `;

    db.query(checkUserQuery, [nom_proche, numero_carte_vitale_proche], (checkErr, existingUser) => {
        if (checkErr) {
            console.error('Erreur 500 : Erreur lors de la connexion:', checkErr);
            res.status(500).json({ message: 'Erreur 500 : Erreur lors de la connexion' });
        } else {
            if (existingUser.length > 0) {
                // On génère un token JWT pour l'utilisateur
                const token = jwt.sign({ userId: existingUser[0].id, idProche: existingUser[0].utilisateur_id }, secretKey, { expiresIn: '1h' });

                // L'utilisateur existe, on considère la connexion comme réussie et on renvoie le token
                res.status(200).json({ message: 'Connexion Reussi', token, idProche: existingUser[0].utilisateur_id });

            } else {
                // L'utilisateur n'existe pas ou le numéro de carte vitale n'est pas valide
                res.status(401).json({ message: 'Erreur 401 : numéro de carte vitale non valide' });
            }
        }
    });
});

// Route de traitement du formulaire de connexion pour les médecins
app.post('/login_medecin', (req, res) => {
    const { idMedecin, inputMdp } = req.body;

    // Vérification sur le numéro du médecin et le mot de passe 
    const checkUserQuery = "SELECT * FROM Medecins WHERE numero_medecin = ? AND mot_de_passe = ?";
    db.query(checkUserQuery, [idMedecin, inputMdp], (checkErr, existingUser) => {
        if (checkErr) {
            console.error('Erreur 500 : Erreur lors de la connexion : ', checkErr);
            res.status(500).json({ message: 'Erreur 500 : Erreur lors de la connexion' });
        } else {
            if (existingUser.length > 0) {
                // On génère un token JWT pour l'utilisateur
                const token = jwt.sign({ userId: existingUser[0].id, idMedecin: existingUser[0].numero_medecin }, secretKey, { expiresIn: '1h' });

                // L'utilisateur existe, on considère la connexion comme réussie et on renvoie le token
                res.status(200).json({ message: 'Connexion Reussi', token, idMedecin: existingUser[0].numero_medecin });

            } else {
                // Erreur l'utilisateur n'existe pas ou les données ne sont pas bonnes
                res.status(401).json({ message: 'Erreur 401 : l\'utilisateur n\'existe pas ou les données ne sont pas bonnes' });
            }
        }
    });
});



// On recupere les infos sur les maladies pour les afficher dans le formulaire
app.get('/options', async (req, res) => {
    const categories = [
        'respiratoires',
        'cardiovasculaires',
        'faciauxCephaliques',
        'digestifs',
        'articulairesMusculaires',
        'neurologiques',
        'poidsAppetit',
        'cutanes',
        'visuels',
        'endocriniens',
        'moodPsychologiques',
    ];

    const options = {};

    const fetchOptions = async (category) => {
        return new Promise((resolve, reject) => {
            // Requête pour obtenir les symptômes distincts de la catégorie de maladies
            const query = `SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(symptomes, '$[*]')) AS symptome FROM Maladies WHERE categorie = ?`;

            db.query(query, [category], (err, results) => {
                if (err) {
                    console.error(`Erreur lors de la récupération de donnés des catégories : ${category}:`, err);
                    reject(err);
                } else {
                    // Stockage des symptômes dans l'objet options
                    options[category] = results.map(result => result.symptome);
                    resolve();
                }
            });
        });
    };

    try {
        // Récupération de toute les categories et leurs options
        await Promise.all(categories.map(category => fetchOptions(category)));
        res.json(options);
        // Gestion des erreurs en renvoyant une réponse d'erreur interne du serveur
    } catch (error) {
        res.status(500).json({ error: 'Erreur 500 : erreur interne' });
    }
});


// Strategie de determination de la maladie et les symptomes communs
app.post('/forminfos', (req, res) => {
    try {
        const { idMalade, dataForm } = req.body;

        // Vérification de la présence et du format correct du champ dataForm dans la requête
        if (!dataForm || !Array.isArray(dataForm) || dataForm.length === 0) {
            return res.status(400).json({ error: 'Erreur 400 : Le champ dataForm est manquant ou incorrect dans la requête.' });
        }

        // Récupére toutes les maladies de la db
        const sql = 'SELECT * FROM Maladies';
        db.query(sql, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Erreur 500 : Erreur serveur' });
            }

            // Vérification si des maladies ont été trouvées dans la base de données
            if (results.length === 0) {
                return res.status(404).json({ error: 'Erreur 404 : Aucune maladie n\'a été trouvée dans la base de données.' });
            }

            let maladieMaxSymptomes = null;
            let maxSymptomesCommuns = 0;

            // Parcours de toutes les maladies pour déterminer celle avec le plus de symptômes communs
            results.forEach((maladie) => {
                const symptomesMaladie = JSON.parse(maladie.symptomes);

                const commonSymptoms = dataForm.filter(symptomeFormulaire => {
                    const symptomeFormulaireLower = symptomeFormulaire.toLowerCase();
                    return symptomesMaladie.some(symptomeMaladie => symptomeMaladie.toLowerCase() === symptomeFormulaireLower);
                });

                if (commonSymptoms.length > maxSymptomesCommuns) {
                    maxSymptomesCommuns = commonSymptoms.length;
                    maladieMaxSymptomes = maladie;
                }
            });

            let maladie = JSON.stringify(maladieMaxSymptomes.maladie, null, 2);

            // Faire la requete pour inserer la maladie dans la table maladies_patient
            const updateMaladeQuery = 'UPDATE Malades SET maladies_patient = CONCAT_WS(", ", maladies_patient, ?) WHERE utilisateur_id = ?';
            db.query(updateMaladeQuery, [maladie, idMalade], (updateErr) => {
                if (updateErr) {
                    console.error('Erreur lors de l\'ajout de la maladie au malade : ' + updateErr.stack);
                    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
                } else {
                    console.log("Maladie ajouté au malade");
                }
            });
            res.json({ maladie: maladieMaxSymptomes, symptomesCommuns: maxSymptomesCommuns });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur 500 : Erreur serveur' });
    }
});


app.post("/patients", (req, res) => {

    // Dans la table Medecin il y a un champ malades_pris_en_charge qui contient les id des malades pris en charge par le medecin
    // On recupere la liste des malades pris en charge par le medecin
    const { idMedecin } = req.body;
    const query = "SELECT * FROM Medecins WHERE numero_medecin = ?";
    db.query(query, [idMedecin], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erreur 500 : Erreur serveur" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Erreur 404 : Aucun medecin n'a été trouvé dans la base de données." });
        }

        const maladesPrisEnCharge = results[0].malades_pris_en_charge;
        const maladesPrisEnChargeArray = maladesPrisEnCharge.split(", ");

        // On recupere les infos des malades pris en charge par le medecin
        const query2 = "SELECT * FROM Malades m JOIN Utilisateurs u ON m.utilisateur_id = u.id WHERE m.utilisateur_id IN (?)";
        db.query(query2, [maladesPrisEnChargeArray], (err2, results2) => {
            if (err2) {
                console.error(err2);
                return res.status(500).json({ error: "Erreur 500 : Erreur serveur" });
            }

            if (results2.length === 0) {
                return res.status(404).json({ error: "Erreur 404 : Aucun malade n'a été trouvé dans la base de données." });
            }
            res.json(results2);
        });
    });
});

app.post("/malade", (req, res) => {
    const { idProche } = req.body;
    const query = "SELECT u.id FROM Utilisateurs u JOIN Proches p ON u.nom = p.nom_proche WHERE u.type_utilisateur = 'Malade' AND p.utilisateur_id = ?";
    db.query(query, [idProche], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erreur serveur" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Aucun malade n'a été trouvé dans le base de données." })
        }
        console.log('le malade : ' + JSON.stringify(results));
        res.json(results[0].id);
    });
});

// Route pour obtenir les détails d'un patient en fonction de son identifiant utilisateur

app.get('/details_patient/:utilisateur_id', (req, res) => {
    const utilisateurId = req.params.utilisateur_id;

    // Requête pour récupérer les détails du patient
    const query = 'SELECT * FROM Malades m JOIN Utilisateurs u ON m.utilisateur_id = u.id WHERE m.utilisateur_id = ?';

    db.query(query, [utilisateurId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur 500 : Erreur serveur' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Erreur 404 : Aucun patient trouvé avec cet identifiant.' });
        }

        // Récupération des détails du patient
        const patientDetails = results[0];

        res.json(patientDetails);
    });
});


app.listen(port, () => {
    console.log(`Serveur principal est en ligne et tourne sur le port : ${port}`);
});

