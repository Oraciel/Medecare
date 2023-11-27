import express from 'express';
import mysql from 'mysql';
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';

// Convertit import.meta.url en un chemin de fichier
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supposant que server.js est dans le dossier backend
const envFileName = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
const envPath = path.resolve(__dirname, `../${envFileName}`);
dotenv.config({ path: envPath });

// Configuration du serveur Express
const app = express();
const portBd = process.env.PORTBd;
const port = process.env.PORTCapteurs;

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

function simulateAsyncOperation() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 5000); // Pour timer les Promise (mis à 5 secondes)
    });
}
db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données : ' + err.stack);
        return;
    }
    console.log(`Connecté à la base de données MySQL ${portBd}`);
});

app.post("/startCapteurs", (req, res) => {
    // Ne relance pas toute la logique si le calcul des capteurs a déjà été lancé
    try {
        const { maladeId } = req.body;
        // Fonction pour sauvegarder les données dans le localStorage
        function saveDataToLocalStorage(data) {
            localStorage.setItem('sensorData', JSON.stringify(data));
        }

        // Fonction pour récupérer les données depuis le localStorage
        function getDataFromLocalStorage() {
            const data = localStorage.getItem('sensorData');
            return data ? JSON.parse(data) : {};
        }

        // Initialisation des données des capteurs et des états de données
        let heartRate = [];
        let glucose = [];
        let bodyTemperature = [];
        let bloodPressure = [];
        let accelerometer = { x: 0, y: 0, z: 0 };

        let heartRateState = "";
        let glucoseState = "";
        let bodyTemperatureState = "";
        let bloodPressureState = "";
        let accelerometerState = "";

        // Fonction pour générer des valeurs aléatoires pour les capteurs
        function generateRandomData(option) {
            let min;
            let max;
            switch (option) {
                case "heartRate":
                    min = 40;
                    max = 140;
                    break;
                case "glucose":
                    min = 0.3;
                    max = 1.5;
                    break;
                case "bodyTemperature":
                    min = 30;
                    max = 45;
                    break;
                case "bloodPressure":
                    min = 70;
                    max = 130;
                    break;
                case "accelerometer":
                    min = 0;
                    max = 20;
                    break;
            }
            return Math.floor(Math.random() * (max - min + 1) + min); // Génère une valeur aléatoire entre le min et le max
        }

        // Fonction qui met à jour les états de chaque données
        function setStates(option, value) {
            let state = "";
            let danger = "normal";
            switch (option) {
                case "heartRate":
                    if (value > 120) {
                        state = "BEAUCOUP TROP HAUT"
                        danger = "grave";
                    } else if (value > 100) {
                        state = "TROP HAUT"
                        danger = "moyen";
                    } else if (value < 60) {
                        state = "BEAUCOUP TROP BAS"
                        danger = "grave";
                    } else if (value < 80) {
                        state = "TROP BAS"
                        danger = "moyen";
                    }
                    break;
                case "glucose":
                    if (value > 1.3) {
                        state = "BEAUCOUP TROP HAUT"
                        danger = "grave";
                    } else if (value > 1.1) {
                        state = "TROP HAUT"
                        danger = "moyen";
                    } else if (value < 0.5) {
                        state = "BEAUCOUP TROP BAS"
                        danger = "grave";
                    } else if (value < 0.7) {
                        state = "TROP BAS"
                        danger = "moyen";
                    }
                    break;
                case "bodyTemperature":
                    if (value > 42) {
                        state = "BEAUCOUP TROP HAUT"
                        danger = "grave";
                    } else if (value > 39) {
                        state = "TROP HAUT"
                        danger = "moyen";
                    } else if (value < 36) {
                        state = "BEAUCOUP TROP BAS"
                        danger = "grave";
                    } else if (value < 33) {
                        state = "TROP BAS"
                        danger = "moyen";
                    }
                    break;
                case "bloodPressure":
                    if (value > 120) {
                        state = "BEAUCOUP TROP HAUT"
                        danger = "grave";
                    } else if (value > 110) {
                        state = "TROP HAUT"
                        danger = "moyen";
                    } else if (value < 80) {
                        state = "BEAUCOUP TROP BAS"
                        danger = "grave";
                    } else if (value < 90) {
                        state = "TROP BAS"
                        danger = "moyen";
                    }
                    break;
            }
            return [state, danger];
        }

        // Fonction pour calculer la moyenne des données
        function calculateAverage(dataArray) {
            const sum = dataArray.reduce((acc, curr) => acc + curr, 0);
            return sum / dataArray.length;
        }

        setInterval(async () => {
            heartRate.push(generateRandomData("heartRate"));
            glucose.push(generateRandomData("glucose"));
            bodyTemperature.push(generateRandomData("bodyTemperature"));
            bloodPressure.push(generateRandomData("bloodPressure"));

            accelerometer = {
                x: generateRandomData("accelerometer"),
                y: generateRandomData("accelerometer"),
                z: generateRandomData("accelerometer")
            };

            // Simulate asynchronous operation
            await simulateAsyncOperation();

            const avgHeartRate = calculateAverage(heartRate);
            const avgGlucose = calculateAverage(glucose);
            const avgBodyTemperature = calculateAverage(bodyTemperature);
            const avgBloodPressure = calculateAverage(bloodPressure);

            const avgAccelerometer = {
                x: accelerometer.x,
                y: accelerometer.y,
                z: accelerometer.z
            };

            const heartRateStates = setStates("heartRate", avgHeartRate);
            const glucoseStates = setStates("glucose", avgGlucose);
            const bodyTemperatureStates = setStates("bodyTemperature", avgBodyTemperature);
            const bloodPressureStates = setStates("bloodPressure", avgBloodPressure);

            let date = new Date();

            let jour = date.getDate().toString().padStart(2, '0');
            let mois = (date.getMonth() + 1).toString().padStart(2, '0');
            let annee = (date.getFullYear() % 100).toString().padStart(2, '0');
            let heures = date.getHours().toString().padStart(2, '0');
            let minutes = date.getMinutes().toString().padStart(2, '0');
            let dateFormatee = `${jour}/${mois}/${annee} ${heures}:${minutes}`;

            const query = `
                UPDATE Capteurs
                SET
                    battements_coeur = ?,
                    coeur_etat = ?,
                    coeur_danger = ?,
                    glucose = ?,
                    glucose_etat = ?,
                    glucose_danger = ?,
                    temperature = ?,
                    temperature_etat = ?,
                    temperature_danger = ?,
                    pression_sanguine = ?,
                    pression_etat = ?,
                    pression_danger = ?,
                    derniere_maj = ?
                WHERE utilisateur_id = ?
            `;

            db.query(query, [avgHeartRate, heartRateStates[0], heartRateStates[1], avgGlucose,
                glucoseStates[0], glucoseStates[1], avgBodyTemperature, bodyTemperatureStates[0],
                bodyTemperatureStates[1], avgBloodPressure, bloodPressureStates[0], bloodPressureStates[1],
                dateFormatee, maladeId], (err, results) => {

                    if (err) {
                        console.error(err);
                        // Handle the error and return an appropriate response
                        return res.status(500).json({ error: 'Erreur capteurs' });
                    }
                    if (results.affectedRows === 0) {
                        const query2 = ` INSERT INTO Capteurs (utilisateur_id, battements_coeur, coeur_etat, coeur_danger, 
                       glucose, glucose_etat, glucose_danger, 
                       temperature, temperature_etat, temperature_danger, pression_sanguine,
                       pression_etat, pression_danger, derniere_maj) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                        db.query(query2, [maladeId, avgHeartRate, heartRateStates[0], heartRateStates[1], avgGlucose, glucoseStates[0], glucoseStates[1], avgBodyTemperature, bodyTemperatureStates[0], bodyTemperatureStates[1], avgBloodPressure, bloodPressureStates[0], bloodPressureStates[1], dateFormatee], (err, results) => {
                            if (err) {
                                console.error(err);
                                // Handle the error and return an appropriate response
                                return res.status(500).json({ error: 'Erreur capteurs' });
                            }
                        });

                    }
                });

            const query4 = ` 
            INSERT INTO HistoriqueMalade (
                utilisateur_id,
                battements_coeur,
                coeur_danger,
                glucose,
                glucose_danger,
                temperature,
                temperature_danger,
                pression_sanguine,
                pression_danger,
                date_maj
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            db.query(query4, [maladeId, avgHeartRate, heartRateStates[1], avgGlucose,
                glucoseStates[1], avgBodyTemperature, bodyTemperatureStates[1], avgBloodPressure,
                bloodPressureStates[1], dateFormatee], (err, results) => {

                    if (err) {
                        console.error(err);
                        // Handle the error and return an appropriate response
                        return res.status(500).json({ error: 'Erreur capteurs - historique' });
                    }
                });

            // Réinitialisation des tableaux pour la prochaine minute
            heartRate = [];
            glucose = [];
            bodyTemperature = [];
            bloodPressure = [];
            accelerometer = { x: 0, y: 0, z: 0 };
        }, 10000); // Update every 60 seconds

        res.json({ message: 'Capteurs started successfully' }); // Send the initial response

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur capteurs' });
    }
});



// Récupère les données de capteurs du patient voulu (utilise l'id utilisateur, pas le numéro)
app.post("/capteurs", async (req, res) => {
    try {
        const { idUserMalade } = req.body;
        const query = "SELECT * FROM Capteurs WHERE utilisateur_id = ?";

        const results = await new Promise((resolve, reject) => {
            db.query(query, [idUserMalade], (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(results);
            });
        });

        if (results.length === 0) {
            return res.status(404).json({ error: "Aucun capteurs n'ont été trouvé dans la base de données." });
        }

        console.log("Resultats" + JSON.stringify(results, null, 2));
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.post("/historique", async (req, res) => {
    try {
        const { idUserMalade } = req.body;
        const query = "SELECT * FROM HistoriqueMalade WHERE utilisateur_id = ?"

        const results = await new Promise((resolve, reject) => {
            db.query(query, [idUserMalade], (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(results);
            });
        });

        console.log("Resultats" + JSON.stringify(results, null, 2));

        const historique = results;
        res.json(historique);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Afficher que le port est demarre
app.listen(port, () => {
    console.log(`MicroService des capteurs lancé sur le port ${port}`);
});