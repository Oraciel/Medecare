import "../../../composantsCss/tableauDeBord.scss";
import "../../../composantsCss/details.scss";
import { useNavigate } from "react-router-dom";
import Deconnexion from "../../../composants/Deconnexion.jsx";
import { useEffect, useState } from "react";
import imgLogo from "../../../public/assets/Logo_MedECare_LightV.png";

function HistoriqueMalade() {
  const navigate = useNavigate();

  const [historiqueConsultations, setHistoriqueConsultations] = useState([]);

  const currentDate = new Date().toLocaleString();

  useEffect(() => {
    // récupère le jeton de connexion
    const token = localStorage.getItem("token");

    // Si la personne n'est pas connecté donc n'a pas de jeton on la redirige
    if (!token) {
      navigate("/");
    }

    // Récupère les précédentes consultation
    const storedConsultations =
      JSON.parse(localStorage.getItem("dataConsultations")) || [];

    // Ajout des précédentes consultation
    setHistoriqueConsultations(storedConsultations);
  }, [navigate]);

  // GERE LES REDIRECTIONS
  const handleLogo = () => {
    navigate(-1);
  };

  const handleRetour = () => {
    navigate(-1);
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
          <h2>ESPACE</h2>
        </div>

        <Deconnexion
          onDeconnexion={() => {
            alert("Vous êtes déconnecté(e)");
            navigate("/home");
          }}
        />
      </nav>

      {/* CONTENT */}
      <div className="content-container-details-patient">
        {/* TITRE */}
        <div className="top-container">
          <div className="title-left"></div>
          <div className="title-center nom-personne">HISTORIQUE</div>
          <div className="title-right">
            <a className="big-text" onClick={handleRetour}>
              RETOUR
            </a>
          </div>
        </div>

        {/* PARTIE HISTORIQUE */}
        <div className="content-container">
          <table className="details-table">
            <thead>
              <tr>
                <th className="">Date</th>
                <th className="">Symptôme</th>
                <th className="">Diagnostic</th>
              </tr>
            </thead>

            {/* POUR CHAQUE CONSULTATION */}
            <tbody>
              {historiqueConsultations.map((consultation, index) => (
                <tr key={index}>
                  <td className="date">{currentDate}</td>
                  <td className="">{consultation.maladie.symptomes}</td>
                  <td className="">{consultation.maladie.maladie}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HistoriqueMalade;
