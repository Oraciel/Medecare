import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../composantsCss/LoginRegister.scss";
import imgLogo from "../../public/assets/Logo_MedECare_LightV.png"

function LoginProche() {
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [nomProche, setNomProche] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  // Fonction appelée lors de la tentative de connexion
  const handleLogin = async () => {
    // Retire les espace du code de carte vital
    const cleanedCardNumber = cardNumber.replace(/\s/g, "");

    try {
      // Requête au serveur pour la connexion du PROCHE
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/login_proche`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          // Envoie le nom du proche et son numéros de carte vital
          body: JSON.stringify({
            nom_proche: nomProche,
            numero_carte_vitale_proche: cleanedCardNumber,
          }),
        }
      );

      // Erreur de conexion
      if (!response.ok) {
        throw new Error("Erreur de connexion");
      }

      // Récupération des données du proche et du malade
      const data = await response.json();

      // créer un jeton de session et un id du proche
      localStorage.setItem("token", data.token);
      localStorage.setItem("idProche", data.idProche);

      // Redirige vers le tableau de bord du proche
      navigate("/tableau_de_bord_proche");
    } catch (error) {
      console.error("Erreur pendant la connexion : ", error);
    }
  };

  // GERE LES REDIRECTIONS
  const handleCreateAccount = () => {
    navigate("/register_proche");
  };

  const handleLogo = () => {
    navigate("/");
  };

  // Fonction pour gérer les changements dans l'input
  function handleInputFormat(e) {
    const inputString = e.target.value.replace(/\D/g, ""); // Supprimer tout sauf les chiffres
    let formattedInput = "";

    // Met sous le format : X XX XX XX XXX XXX
    for (let i = 0; i < inputString.length; i++) {
      if (i === 1 || i === 3 || i === 5 || i === 7 || i === 10) {
        formattedInput += " " + inputString[i];
      } else {
        formattedInput += inputString[i];
      }
    }

    // Limiter la saisie à 18 caractères
    if (formattedInput.length <= 18) {
      setCardNumber(formattedInput);
    }
  }

  let inputBackgroundStyle = "red-background";

  if (cardNumber.length === 18) {
    inputBackgroundStyle = "green-background";
  } else if (cardNumber.length === 0) {
    inputBackgroundStyle = "gray-background";
  }

  return (
    <div className="login-container">
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

      <div className="container-connexion-proche container-connexion">
        <h2 className="sub-title">Connexion espace proche</h2>
        {/* FORMULAIRE DE CONNEXION PROCHE */}
        <form action="" className="login-main-part">
          <label htmlFor="">Entrer le nom du proche</label>
          <input
            type="text"
            placeholder="CLIQUER ICI"
            value={nomProche}
            onChange={(e) => setNomProche(e.target.value)}
          />

          <label htmlFor="">Entrer le code du proche</label>
          <input
            type="text"
            placeholder="CLIQUER ICI"
            value={cardNumber}
            onChange={handleInputFormat}
            className={inputBackgroundStyle}
            title="Le code du proche fait référence à son code de sécurité sociale"
          />
          <div className="buttons-container">
            <button type="button" onClick={handleLogin}>
              Se connecter
            </button>
            <button type="button" onClick={handleCreateAccount}>
              Créer un compte
            </button>
          </div>
          <a href="/">Retour</a>
          {loginMessage && <p>{loginMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginProche;
