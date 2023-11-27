import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../composantsCss/LoginRegister.scss";
import imgLogo from "../../public/assets/Logo_MedECare_LightV.png"

function RegisterMalade() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    numero_carte_vitale: "",
    adresse: "",
    date_naissance: "",
    genre: "",
    medecin_traitant: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleLogo = () => {
    navigate("/");
  };

  // Gestion de la carte vitale
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "numero_carte_vitale" && value.length > 13) {
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "numero_carte_vitale" ? value.replace(/\D/g, "") : value,
    }));
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

    if (!formData.medecin_traitant.trim()) {
      errors.medecin_traitant = "Le numero du médecin traitant est requis";
    }

    if (!formData.date_naissance) {
      errors.date_naissance = "La date de naissance est requise";
    } else {
      const birthDate = new Date(formData.date_naissance);
      const currentDate = new Date();
      const age = currentDate.getFullYear() - birthDate.getFullYear();

      // date de naissance valide
      const isValidDate =
        birthDate.getFullYear() >= 1900 &&
        birthDate < currentDate &&
        birthDate.getDate() === new Date(formData.date_naissance).getDate() &&
        birthDate.getMonth() === new Date(formData.date_naissance).getMonth();

      if (age < 18 || !isValidDate) {
        errors.date_naissance = "La date de naissance n'est pas valide";
      }
    }

    if (!formData.numero_carte_vitale) {
      errors.numero_carte_vitale = "Le numéro de carte vitale est requis";
      // format de la carte vitale
    } else if (!/^[0-9]{13}$/.test(formData.numero_carte_vitale)) {
      errors.numero_carte_vitale =
        "Le numéro de carte vitale doit avoir 13 chiffres";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Fonction appelée lors de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    // Si le formulaire est valide, envoie une requête POST au serveur pour l'inscription
    if (validateForm()) {
      fetch(`${import.meta.env.VITE_API_URL}/register_malade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          // Si pas d'erreur on redige la page de connexion
          navigate("/login_malade");
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
        <h2>Connexion espace médecin</h2>
      </div>

      <div className="container-register-malade container-register">
        <h2 className="sub-title">Inscription espace malade</h2>

        {/* FORMULAIRE D'INSCRIPTION MALADE */}
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

          <label htmlFor="numero_carte_vitale">
            Entrer votre numéro de carte vitale
          </label>
          <input
            type="text"
            placeholder="CLIQUER ICI"
            name="numero_carte_vitale"
            onChange={handleChange}
            value={formData.numero_carte_vitale}
          />
          {validationErrors.numero_carte_vitale && (
            <div className="error-message">
              {validationErrors.numero_carte_vitale}
            </div>
          )}

          <label htmlFor="adresse">Entrer votre adresse</label>
          <input
            type="text"
            placeholder="CLIQUER ICI"
            name="adresse"
            onChange={handleChange}
          />

          <label htmlFor="date_naissance">Entrez votre date de naissance</label>
          <input
            type="date"
            name="date_naissance"
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
          />
          {validationErrors.date_naissance && (
            <div className="error-message">
              {validationErrors.date_naissance}
            </div>
          )}

          <label htmlFor="genre">Entrer votre genre</label>
          <select name="genre" defaultValue="option1" onChange={handleChange}>
            <option value="option1">CLIQUER ICI</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>

          <label htmlFor="medecin_traitant">
            Entrez le numero de votre medecin traitant
          </label>
          <input
            type="text"
            placeholder="CLIQUER ICI"
            name="medecin_traitant"
            onChange={handleChange}
          />
          {validationErrors.date_naissance && (
            <div className="error-message">
              {validationErrors.date_naissance}
            </div>
          )}

          <input
            type="submit"
            className="submit-btn"
            value={"Créer le compte"}
          />
          <a href="/login_malade">Retour</a>
        </form>
      </div>
    </div>
  );
}

export default RegisterMalade;
