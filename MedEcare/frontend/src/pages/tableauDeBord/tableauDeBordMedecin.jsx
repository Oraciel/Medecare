import "../../composantsCss/tableauDeBord.scss";
import { useNavigate } from "react-router-dom";
import Deconnexion from "../../composants/Deconnexion.jsx";
import { useEffect, useState } from "react";
import * as jose from "jose";
import imgLogo from "../../public/assets/Logo_MedECare_LightV.png";

function TableauDeBordMedecin() {
  const navigate = useNavigate();
  const [medecinId, setMedecinId] = useState("");
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // récupère le jeton de connexion
    const token = localStorage.getItem("token");

    // Si la personne n'est pas connecté donc n'a pas de jeton
    if (!token) {
      navigate("/login_medecin");
    } else {
      // Outil pour décoder le jeton crypter
      const decodedToken = jose.decodeJwt(token);

      // Si cela fonction il prend l'id du medecin et de ses patients
      if (decodedToken) {
        setMedecinId(decodedToken.idMedecin);
        fetchPatients(decodedToken.idMedecin);
      }
    }
  }, [navigate]);

  // récupérer la liste des patients associés à un médecin
  const fetchPatients = async (idMedecin) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idMedecin }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des patients");
      }

      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des patients : ",
        error.message
      );
    }
  };

  const handleLogo = () => {
    navigate("/tableau_de_bord_medecin");
  };

  return (
    <div className="tableau-de-bord-container-medecin">
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
          <h2>TABLEAU DE BORD : {medecinId}</h2>
        </div>

        <Deconnexion
          onDeconnexion={() => {
            alert("Vous êtes déconnecté(e)");
            navigate("/login_medecin");
          }}
        />
      </nav>

      {/* CONTENT */}
      <div className="main-container">
        {/* BARRE POUR FILTRE (pour V3) */}
        <div className="sidebar">
          <div className="big-text decallage-droite">Trier par :</div>
          <div className="trie">
            <div className="ordre column-medecin decallage-droite big-text">
              <div className="affichage-ordre">Ordre :</div>
              <div className="checkbox-container">
                <div className="checkbox-container-item">
                  <label className="label-chk">croissant</label>
                  <input
                    type="checkbox"
                    name="test"
                    id=""
                    className="input-chk"
                  />
                </div>
                <div className="checkbox-container-item">
                  <label className="label-chk">décroissant</label>
                  <input
                    type="checkbox"
                    name="test"
                    id=""
                    className="input-chk"
                  />
                </div>
                <div className="checkbox-container-item">
                  <label className="label-chk">état de santé</label>
                  <input
                    type="checkbox"
                    name="test"
                    id=""
                    className="input-chk"
                  />
                </div>
                <div className="checkbox-container-item">
                  <label className="label-chk">âge</label>
                  <input
                    type="checkbox"
                    name="test"
                    id=""
                    className="input-chk"
                  />
                </div>
                <div className="checkbox-container-item">
                  <label className="label-chk">alphabétique</label>
                  <input
                    type="checkbox"
                    name="test"
                    id=""
                    className="input-chk"
                  />
                </div>
              </div>
            </div>
            <div className=" column-medecin decallage-droite big-text">
              <div className="affichage-ordre">Affichage :</div>
              <div className="checkbox-container">
                <div className="checkbox-container-item">
                  <label className="label-chk">tout afficher</label>
                  <input
                    type="checkbox"
                    name="test"
                    id=""
                    className="input-chk"
                  />
                </div>
                <div className="checkbox-container-item">
                  <label className="label-chk">plus importantes</label>
                  <input
                    type="checkbox"
                    name="test"
                    id=""
                    className="input-chk"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="big-text center lien">Statistiques</div>
          <div className="big-text center lien">Options</div>
        </div>

        {/* CONTENU AVEC TOUTE LES FICHES PATIENTS */}
        <div className="content-container-medecin">
          {/* POUR CHAQUE PATIENT IL CREER SA CARTE */}
          {patients.map((patient) => (
            <div className="item" key={patient.id}>
              <div className="item-header">
                <div className="item-name">{patient.nom}</div>
                <a
                  href={`/details_patient/${patient.utilisateur_id}`}
                  className="voir-plus"
                >
                  VOIR PLUS
                </a>
              </div>
              <div className="item-text">
                Atteint de : {patient.maladies_patient}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TableauDeBordMedecin;
