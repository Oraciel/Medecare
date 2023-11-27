import { useState } from "react";
import "../../composantsCss/LoginRegister.scss";
import { useNavigate } from "react-router-dom";

function RegisterMedecin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    numero_medecin: "",
    adresse_professionnelle: "",
    specialite: "",
    mot_de_passe: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleLogo = () => {
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si le champ est "numero_medecin", on s'assure qu'il n'y a que des chiffres et que la longueur est au maximum 6
    if (name === "numero_medecin" && !/^\d{0,6}$/.test(value)) {
      return;
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Toute les conditions pour sumbit le formulaire
  const validateForm = () => {
    const errors = {};

    if (!formData.nom.trim()) {
      errors.nom = "Le nom est requis";
    }

    if (!formData.prenom.trim()) {
      errors.prenom = "Le prénom est requis";
    }

    if (!formData.numero_medecin.trim()) {
      errors.numero_medecin = "Le numéro de médecin est requis";
    } else if (!/^[0-9]{6}$/.test(formData.numero_medecin)) {
      errors.numero_medecin =
        "Le numéro de médecin doit avoir exactement 6 chiffres";
    }

    if (!formData.adresse_professionnelle.trim()) {
      errors.adresse_professionnelle = "L'adresse de profession est requise";
    }

    if (!formData.specialite.trim()) {
      errors.specialite = "La spécialité est requise";
    }

    if (!formData.mot_de_passe.trim()) {
      errors.mot_de_passe = "Le mot de passe est requis";
    } else if (formData.mot_de_passe.length < 6) {
      errors.mot_de_passe = "Le mot de passe doit avoir au moins 6 caractères";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Si le formulaire est valide, envoie une requête POST au serveur pour l'inscription
    if (validateForm()) {
      fetch(`${import.meta.env.VITE_API_URL}/register_medecin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          // Si pas d'erreur on redige la page de connexion
          navigate("/login_medecin");
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
            src="frontend/src/assets/Logo_MedECare_LightV.png"
            alt="Logo de l'application"
            className="app-logo"
          />
          <h1 className="title">MedECare</h1>
        </div>
      </div>

      <div className="container-register-medecin container-register">
        <h2 className="sub-title">Inscription espace médecin</h2>

        {/* FORMULAIRE D'INSCRIPTION MEDECIN */}
        <form onSubmit={handleSubmit} className="register-main-part">
          <label htmlFor="nom">Entrer votre nom</label>
          <input
            type="text"
            placeholder="CLIQUER ICI"
            name="nom"
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
            onChange={handleChange}
          />
          {validationErrors.prenom && (
            <div className="error-message">{validationErrors.prenom}</div>
          )}

          <label htmlFor="numero_medecin">Entrer votre numéro de médecin</label>
          <input
            type="text"
            placeholder="CLIQUER ICI"
            name="numero_medecin"
            onChange={handleChange}
          />
          {validationErrors.numero_medecin && (
            <div className="error-message">
              {validationErrors.numero_medecin}
            </div>
          )}

          <label htmlFor="adresse_professionnelle">
            Entrer une adresse de profession
          </label>
          <input
            type="text"
            placeholder="CLIQUER ICI"
            name="adresse_professionnelle"
            onChange={handleChange}
          />

          <label htmlFor="specialite">Entrer votre spécialité</label>
          <input
            type="text"
            placeholder="CLIQUER ICI"
            name="specialite"
            onChange={handleChange}
          />

          <label htmlFor="mot_de_passe">Entrer un mot de passe</label>
          <input
            type="text"
            placeholder="CLIQUER ICI"
            name="mot_de_passe"
            onChange={handleChange}
          />
          <input
            type="submit"
            className="submit-btn"
            value={"Créer le compte"}
          />
          <a href="/login_medecin">Retour</a>
        </form>
      </div>
    </div>
  );
}

export default RegisterMedecin;
