import "../../../composantsCss/tableauDeBord.scss";
import "../../../composantsCss/details.scss";
import { useNavigate, useParams } from "react-router-dom";
import Deconnexion from "../../../composants/Deconnexion.jsx";
import React, { useEffect, useState } from "react";
import * as jose from "jose";
import imgLogo from "../../../public/assets/Logo_MedECare_LightV.png";

function DetailsPatient() {
  const navigate = useNavigate();
  const { utilisateur_id } = useParams();
  const [patientDetails, setPatientDetails] = useState(null);
  const [historique, setHistorique] = useState({});

  // Fonction qui récupère les donnés du patient
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
  }, [navigate]);

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
    navigate("/tableau_de_bord_medecin");
  };

  return (
    <div className="detail-patient-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="brand" onClick={handleLogo}>
          <img
            src={imgLogo}
            alt="Logo de l'application"
            className="app-logo-V1"
          />
          <h1 className="title">MedECare</h1>
        </div>

        <div className="center-title">
          <h2>ESPACE MÉDECIN</h2>
        </div>

        <Deconnexion
          onDeconnexion={() => {
            alert("Vous êtes déconnecté(e)");
            navigate("/login_medecin");
          }}
        />
      </nav>

      {/* CONTENT */}
      <div className="content-container-details-patient">
        {/* TITRE */}
        <div className="top-container">
          <div className="title-left"></div>
          <div className="title-center nom-personne">Détails malade</div>
          <div className="title-right">
            <a className="big-text" href="/tableau_de_bord_medecin">
              RETOUR
            </a>
          </div>
        </div>

        {/* INFORMATIONS PATIENT */}
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
        <div className="bottom-container">
          <button>DEMANDER DE VOIR LE PATIENT</button>
          <button>CONTACTER LE PATIENT</button>
          <button>VOIR LA LOCALISATION DU PATIENT</button>
        </div>
      </div>
    </div>
  );
}

export default DetailsPatient;
