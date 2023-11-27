import "../../../composantsCss/tableauDeBord.scss";
import "../../../composantsCss/details.scss";
import { useNavigate, useParams } from "react-router-dom";
import Deconnexion from "../../../composants/Deconnexion.jsx";
import React, { useState, useEffect } from 'react';
import * as jose from "jose";


function DetailsMaladeProche() {
    const navigate = useNavigate();

    const [patientDetails, setPatientDetails] = useState(null);
    const [historique, setHistorique] = useState({});
    const { utilisateur_id } = useParams();

    // Vérification que l'utilisateur est bien connecté
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        } else {
            const decodedToken = jose.decodeJwt(token);

            if (decodedToken) {
                fetchHistorique(utilisateur_id);
                fetchPatientDetails();
            }
        }
    }, [navigate, utilisateur_id]);

    const fetchHistorique = async (maladeId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL_CAPTEURS}/historique`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ idUserMalade: maladeId }),
            });

            if (!response.ok) {
                throw new Error("Error fetching historique");
            }

            const data = await response.json();
            if (Object.keys(data).length > 0) {
                setHistorique(data);
            }
        } catch (error) {
            console.error("Error fetching historique:", error.message);
        }
    };

    // Fetch patient details based on utilisateur_id
    const fetchPatientDetails = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/details_patient/${utilisateur_id}`
            );

            if (!response.ok) {
                throw new Error("Erreur pour récupérer les données du patient");
            }

            const data = await response.json();
            setPatientDetails(data);
        } catch (error) {
            console.error(
                "Erreur pour récupérer les données du patient :",
                error.message
            );
        }
    };

    if (!patientDetails) {
        return <div>Loading...</div>;
    }

    const handleLogo = () => {
        navigate("/tableau_de_bord_proche");
    };

    return (
        <div className="detail-patient-container">
            <nav className="navbar">
                <div className="brand" onClick={handleLogo}>
                    <img
                        src="frontend\src\assets\Logo_MedECare_LightV.png"
                        alt="Logo de l'application"
                        className="app-logo-V1"
                    />
                    <h1 className="title">MedECare</h1>
                </div>

                <div className="center-title">
                    <h2>ESPACE PROCHE</h2>
                </div>

                <Deconnexion onDeconnexion={() => {
                    alert("Vous êtes déconnecté(e)");
                    navigate('/login_malade');
                }} />
            </nav>
            <div className="content-container-details-patient">
                <div className="top-container">
                    <div className="title-left"></div>
                    <div className="title-center nom-personne">Détails malade</div>
                    <div className="title-right">
                        <a className="big-text" href="/tableau_de_bord_proche">
                            RETOUR
                        </a>
                    </div>
                </div>
                <div className="content-container">
                    <table className="details-table">
                        <thead>
                            <tr>
                                <th className="">Date</th>
                                <th className="">Rythme cardiaque</th>
                                <th className="">Température corporelle</th>
                                <th className="">Tension artérielle</th>
                                <th className="">Glicémie</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(historique).length > 0 && [...historique].reverse().map((item, index) => (
                                <tr key={index}>
                                    <td>{item.date_maj}</td>
                                    <td className={`valeur-${item.coeur_danger}`}>
                                        {item.battements_coeur} BPM
                                    </td>
                                    <td className={`valeur-${item.temperature_danger}`}>
                                        {item.temperature} °C
                                    </td>
                                    <td className={`valeur-${item.pression_danger}`}>
                                        {item.pression_sanguine} / 60
                                    </td>
                                    <td className={`valeur-${item.glucose_danger}`}>
                                        {item.glucose} mg/dL
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DetailsMaladeProche;
