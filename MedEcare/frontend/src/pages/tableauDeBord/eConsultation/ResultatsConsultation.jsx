import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Deconnexion from "../../../composants/Deconnexion.jsx";
import "../../../composantsCss/eConsultation.scss";
import imgLogo from "../../../public/assets/Logo_MedECare_LightV.png";

function ResultatsConsultation() {
  const navigate = useNavigate();

  const [maladie, setMaladie] = useState("");
  const [categorie, setCategorie] = useState("");
  const [symptomes, setSymptomes] = useState([]);
  const [premieresMesures, setPremieresMesures] = useState([]);
  const [nbSymptomes, setNbSymptomes] = useState(0);

  // Vérification que l'utilisateur est bien connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }

    // Récupération des données de la consultation
    let formData = localStorage.getItem("dataConsultation");

    // Mets les données au bon format
    if (formData) {
      formData = JSON.parse(formData);
      setMaladie(formData.maladie.maladie);
      setCategorie(formData.maladie.categorie);

      // Décoder les chaînes JSON pour obtenir des tableaux
      setSymptomes(JSON.parse(formData.maladie.symptomes));
      setPremieresMesures(JSON.parse(formData.maladie.premieres_mesures));

      setNbSymptomes(formData.symptomesCommuns);
    }
  }, [navigate]);

  return (
    <div className="result-econsultation">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="brand">
          <img
            src={imgLogo}
            alt="Logo de l'application"
            className="app-logo-V1"
          />
          <h1 className="title">MedECare</h1>
        </div>

        <div className="center-title">
          <h2>RESULTAT</h2>
        </div>

        <Deconnexion
          onDeconnexion={() => {
            alert("Vous êtes déconnecté(e)");
            navigate("/login_malade");
          }}
        />
      </nav>

      {/* RESULTAT DE LA CONSULTATION */}
      <div className="content-container-econsultation text-center">
        <p className="very-big-text margin">
          Voici le résultat de la consultation
        </p>
        <p className="big-text margin">
          Attention ceci ne dispense pas d'une réelle consultation. Si vous avez
          des doutes contacter votre médecin.
        </p>
        <p className="text">Catégorie : {categorie}</p>
        <p className="margin text">Maladie possible : {maladie}</p>
        <p className="text">Voici les symptômes de cette maladie :</p>
        <ul>
          {symptomes.map((symptome, index) => (
            <li className="text" key={index}>
              {symptome}
            </li>
          ))}
        </ul>
        <p className="margin text">
          Nombre de symptômes communs : {nbSymptomes}
        </p>
        <p className="text">Voici les premières mesures à adopter :</p>
        <ul>
          {premieresMesures.map((mesure, index) => (
            <li className="text" key={index}>
              {mesure}
            </li>
          ))}
        </ul>
        <a className="margin big-text" href="/tableau_de_bord_malade">
          Retour
        </a>
      </div>
    </div>
  );
}

export default ResultatsConsultation;
