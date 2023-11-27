import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../composantsCss/LoginRegister.scss";
import imgLogo from "../../public/assets/Logo_MedECare_LightV.png";

function LoginMalade() {
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [nom, setNom] = useState("");
  const [loginMessage] = useState("");

  // Fonction appelée lors de la tentative de connexion
  const handleLogin = async () => {
    // Retire les espace du code de carte vital
    const cleanedCardNumber = cardNumber.replace(/\s/g, "");

    try {
      // Requête au serveur pour la connexion du patient
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/login_malade`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          // Envoie le nom et le code de la carte vital
          body: JSON.stringify({ cardNumber: cleanedCardNumber, nom }),
        }
      );

      // Erreur de conexion
      if (!response.ok) {
        throw new Error("Erreur de connexion malade");
      }

      // Récupération des données du malade
      const data = await response.json();

      // créer un jeton de session et un id du malade
      localStorage.setItem("token", data.token);
      localStorage.setItem("maladeId", data.idMalade);

      // Redirige vers le tableau de bord du malade
      navigate("/tableau_de_bord_malade");

      // Erreur de connexion
    } catch (error) {
      console.error("Erreur de connexion : ", error);
    }
  };

  // GERE LES REDIRECTIONS
  const handleCreateAccount = () => {
    navigate("/register_malade");
  };

  // GESTION DU FORMAT DE LA CARTE VITAL
  const handleInputFormat = (e) => {
    const inputString = e.target.value.replace(/\D/g, "");
    let formattedInput = "";

    for (let i = 0; i < inputString.length; i++) {
      if (i === 1 || i === 3 || i === 5 || i === 7 || i === 10) {
        formattedInput += " " + inputString[i];
      } else {
        formattedInput += inputString[i];
      }
    }

    if (formattedInput.length <= 18) {
      setCardNumber(formattedInput);
    }
  };

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
        <div className="big-title">
          <img
            src={imgLogo}
            alt="Logo de l'application"
            className="app-logo"
          />
          <h1 className="title">MedECare</h1>
        </div>
      </div>

      {/* CONTENT FORMULAIRE DE CONNEXION MALADE */}
      <div className="container-connexion-malade container-connexion">
        <h2 className="sub-title">Connexion espace malade</h2>
        
        <form action="" className="login-main-part">
          <label htmlFor="">Entrer votre nom</label>
          <input
            type="text"
            placeholder="CLIQUER ICI"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />

          <label htmlFor="">Entrer votre numéro de carte vitale</label>
          <input
            type="text"
            placeholder="CLIQUER ICI"
            value={cardNumber}
            onChange={handleInputFormat}
            className={inputBackgroundStyle}
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

export default LoginMalade;
