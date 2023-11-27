import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../composantsCss/LoginRegister.scss";
import imgLogo from "../../public/assets/Logo_MedECare_LightV.png";

function RegisterProche() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom_proche: "",
    numero_carte_vitale_proche: "",
    nom: "",
    prenom: "",
    lien: "CLIQUER ICI",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleLogo = () => {
    navigate("/");
  };

  // Toute les conditions pour sumbit le formulaire

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nom.trim()) {
      errors.nom = "Le nom est requis";
    }

    if (!formData.numero_carte_vitale_proche) {
      errors.numero_carte_vitale_proche =
        "Le numéro de carte vitale est requis";
    } else if (!/^[0-9]{13}$/.test(formData.numero_carte_vitale_proche)) {
      errors.numero_carte_vitale_proche =
        "Le numéro de carte vitale doit avoir 13 chiffres";
    }

    if (!formData.prenom.trim()) {
      errors.prenom = "Le prénom est requis";
    }

    if (formData.lien === "CLIQUER ICI") {
      errors.lien = "Veuillez sélectionner votre lien avec votre proche";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Fonction appelée lors de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    // Si le formulaire est valide, envoie une requête POST au serveur pour l'inscription
    if (validateForm()) {
      fetch(`${import.meta.env.VITE_API_URL}/register_proche`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          // Si pas d'erreur on redige la page de connexion
          navigate("/login_proche");
        })
        .catch((error) => {
          alert(error.message || "Erreur lors de l'enregistrement");
          console.error("Error:", error);
        });
    }
  };

  return (
    <div className="register-container">
      {/* TITRE */}
      <div className="login-top-part">
        <div className="big-title" onClick={handleLogo}>
          <img
            src={imgLogo}
            alt="Logo de l'application"
            className="app-logo"
          />
          <h1 className="title">MedECare</h1>
        </div>
      </div>

      <div className="container-register-proche container-register">
        <h2 className="sub-title">Inscription espace proche</h2>

        {/* FORMULAIRE D'INSCRIPTION PROCHE */}
        <form onSubmit={handleSubmit} className="register-main-part">
          <label htmlFor="nom">Entrer le nom du proche</label>
          <input
            type="text"
            placeholder="CLIQUER ICI"
            name="nom_proche"
            value={formData.nom_proche}
            onChange={handleChange}
          />

          <label htmlFor="numero_carte_vitale_proche">
            Entrer votre numéro de carte vitale du proche
          </label>
          <input
            type="text"
            placeholder="CLIQUER ICI"
            name="numero_carte_vitale_proche"
            onChange={handleChange}
            value={formData.numero_carte_vitale_proche}
          />

          <label htmlFor="nom">Entrer votre nom</label>
          <input
            type="text"
            placeholder="CLIQUER ICI"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
          />
          {validationErrors.nom && (
            <div className="error-message">{validationErrors.nom}</div>
          )}

          <label htmlFor="prenom">Entrer votre prénom</label>
          <input
            type="text"
            placeholder="CLIQUER ICI"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
          />
          {validationErrors.prenom && (
            <div className="error-message">{validationErrors.prenom}</div>
          )}

          <label htmlFor="lien">Quelle est votre lien avec votre proche</label>
          <select name="lien" onChange={handleChange} value={formData.lien}>
            <option value="CLIQUER ICI" disabled>
              CLIQUER ICI
            </option>
            <option value="Conjoint">Conjoint</option>
            <option value="Parent">Parent</option>
            <option value="Frère/soeur">Frère/soeur</option>
            <option value="Fils/Fille">Fils/Fille</option>
            <option value="Responsable légal">Responsable légal</option>
            <option value="Autre lien">Autre lien</option>
          </select>
          {validationErrors.lien && (
            <div className="error-message">{validationErrors.lien}</div>
          )}

          <input
            type="submit"
            className="submit-btn"
            value={"Créer le compte"}
          />

          <a href="/login_proche">Retour</a>
        </form>
      </div>
    </div>
  );
}

export default RegisterProche;
