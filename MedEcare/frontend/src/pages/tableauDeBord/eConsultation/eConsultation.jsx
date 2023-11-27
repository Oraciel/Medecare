import React, { useEffect, useState } from "react";
import "../../../composantsCss/tableauDeBord.scss";
import "../../../composantsCss/eConsultation.scss";
import { useNavigate } from "react-router-dom";
import Deconnexion from "../../../composants/Deconnexion.jsx";
import * as jose from "jose";
import imgLogo from "../../../public/assets/Logo_MedECare_LightV.png";

function EConsultation() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    respiratoires: "option1",
    cardiovasculaires: "option1",
    faciauxCephaliques: "option1",
    digestifs: "option1",
    articulairesMusculaires: "option1",
    neurologiques: "option1",
    poidsAppetit: "option1",
    cutanes: "option1",
    visuels: "option1",
    endocriniens: "option1",
    moodPsychologiques: "option1",
  });

  const [options, setOptions] = useState({
    respiratoires: [],
    cardiovasculaires: [],
    faciauxCephaliques: [],
    digestifs: [],
    articulairesMusculaires: [],
    neurologiques: [],
    poidsAppetit: [],
    cutanes: [],
    visuels: [],
    endocriniens: [],
    moodPsychologiques: [],
  });

  const handleLogo = () => {
    navigate("/tableau_de_bord_malade");
  };

  // Fonction appelée lorsqu'une option de symptôme est sélectionnée/désélectionnée
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    // Met à jour les options disponibles en filtrant les options déjà sélectionnées dans les autres catégories
    const updatedOptions = { ...options };

    for (const category in updatedOptions) {
      if (category !== name) {
        updatedOptions[category] = options[category].filter(
          (option) => option !== value
        );
      }
    }

    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    // Convertir les catégories de symptômes en un tableau de symptômes
    const symptomesArray = Object.values(formData);
    const storedMaladeId = localStorage.getItem("maladeId");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/forminfos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            dataForm: symptomesArray,
            idMalade: storedMaladeId,
          }),
        }
      );

      //Recuperer reponse serveur JSON sous la forme de res.json({ maladie: maladie, symptomesCommuns: maxSymptomesCommuns });
      const data = await response.json();
      localStorage.setItem("dataConsultation", JSON.stringify(data));

      // Récupérer l'historique des consultations actuel
      const existingConsultations =
        JSON.parse(localStorage.getItem("dataConsultations")) || [];

      // Ajouter la nouvelle consultation à l'historique
      const updatedConsultations = [...existingConsultations, data];

      // Enregistrer l'historique mis à jour dans le localStorage
      localStorage.setItem(
        "dataConsultations",
        JSON.stringify(updatedConsultations)
      );

      navigate("/resultat_consultation");
      console.log("Serveur réponse :", response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/options`);
        const data = await response.json();

        const uniqueOptions = {};

        for (const category in data) {
          const symptomsArray = data[category].flatMap((symptoms) =>
            JSON.parse(symptoms)
          );

          uniqueOptions[category] = [...new Set(symptomsArray)];
        }

        setOptions(uniqueOptions);
      } catch (error) {
        console.error("Erreur de récupération des données:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="econsultation">
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
          <h2>E CONSULTATION</h2>
        </div>

        <Deconnexion
          onDeconnexion={() => {
            alert("Vous êtes déconnecté(e)");
            navigate("/login_malade");
          }}
        />
      </nav>

      {/* FORMULAIRE DE CONSULTATION */}
      <div className="content-container-econsultation">
        <form
          className="register-main-part econsultation-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="respiratoires">Respiratoires</label>
          <select
            name="respiratoires"
            value={formData.respiratoires}
            onChange={handleChange}
          >
            <option value="">Sélectionnez une option</option>
            {options.respiratoires.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="cardiovasculaires">Cardiovasculaires</label>
          <select
            name="cardiovasculaires"
            value={formData.cardiovasculaires}
            onChange={handleChange}
          >
            <option value="">Sélectionnez une option</option>
            {options.cardiovasculaires.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="faciauxCephaliques">Faciaux et Céphaliques</label>
          <select
            name="faciauxCephaliques"
            value={formData.faciauxCephaliques}
            onChange={handleChange}
          >
            <option value="">Sélectionnez une option</option>
            {options.faciauxCephaliques.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="digestifs">Digestifs</label>
          <select
            name="digestifs"
            value={formData.digestifs}
            onChange={handleChange}
          >
            <option value="">Sélectionnez une option</option>
            {options.digestifs.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="articulairesMusculaires">
            Articulaires et Musculaires
          </label>
          <select
            name="articulairesMusculaires"
            value={formData.articulairesMusculaires}
            onChange={handleChange}
          >
            <option value="">Sélectionnez une option</option>
            {options.articulairesMusculaires.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="neurologiques">Neurologiques</label>
          <select
            name="neurologiques"
            value={formData.neurologiques}
            onChange={handleChange}
          >
            <option value="">Sélectionnez une option</option>
            {options.neurologiques.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="poidsAppetit">Poids et Appétit</label>
          <select
            name="poidsAppetit"
            value={formData.poidsAppetit}
            onChange={handleChange}
          >
            <option value="">Sélectionnez une option</option>
            {options.poidsAppetit.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="cutanes">Cutanés</label>
          <select
            name="cutanes"
            value={formData.cutanes}
            onChange={handleChange}
          >
            <option value="">Sélectionnez une option</option>
            {options.cutanes.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="visuels">Visuels</label>
          <select
            name="visuels"
            value={formData.visuels}
            onChange={handleChange}
          >
            <option value="">Sélectionnez une option</option>
            {options.visuels.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="endocriniens">Endocriniens</label>
          <select
            name="endocriniens"
            value={formData.endocriniens}
            onChange={handleChange}
          >
            <option value="">Sélectionnez une option</option>
            {options.endocriniens.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="moodPsychologiques">Mood et Psychologiques</label>
          <select
            name="moodPsychologiques"
            value={formData.moodPsychologiques}
            onChange={handleChange}
          >
            <option value="">Sélectionnez une option</option>
            {options.moodPsychologiques.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <input
            type="submit"
            className="submit-btn"
            value={"Envoyer la consultation"}
          />
          <a href="/tableau_de_bord_malade">Retour</a>
        </form>
      </div>
    </div>
  );
}

export default EConsultation;
