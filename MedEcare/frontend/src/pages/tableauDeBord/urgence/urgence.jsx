import "../../../composantsCss/tableauDeBord.scss";
import "../../../composantsCss/urgence.scss";
import { useNavigate } from "react-router-dom";
import Deconnexion from "../../../composants/Deconnexion.jsx";
import { useEffect } from "react";
import imgLogo from "../../../public/assets/Logo_MedECare_LightV.png";

function Urgence() {
  const navigate = useNavigate();

  useEffect(() => {
    // récupère le jeton de connexion
    const token = localStorage.getItem("token");

    // Si la personne n'est pas connecté donc n'a pas de jeton on la redirige
    if (!token) {
      navigate("/");
    }
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
          <h2>ESPACE MALADE</h2>
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
          <div className="title-left big-text">RETOUR</div>
          <div className="title-center nom-personne">
            QUELLE EST VOTRE URGENCE
          </div>
          <div className="title-right">
            <a className="big-text" onClick={handleRetour}>
              RETOUR
            </a>
          </div>
        </div>

        {/* BONTONS DES URGENCES (pour V3) */}
        <div className="content-container-urgence">
          <button className="btn-urgence btn-pompier very-big-text">
            APPELER LES POMPIERS
          </button>
          <button className="btn-urgence btn-samu very-big-text">
            APPELER LE SAMU
          </button>
          <button className="btn-urgence btn-medecin very-big-text">
            APPELER LE MÉDECIN
          </button>
          <button className="btn-urgence btn-geste-premier-secours very-big-text">
            GESTES DE PREMIER SECOURS
          </button>
        </div>
      </div>
    </div>
  );
}

export default Urgence;
