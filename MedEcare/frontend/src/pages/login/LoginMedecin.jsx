import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../composantsCss/LoginRegister.scss";
import imgLogo from "../../public/assets/Logo_MedECare_LightV.png";

function LoginMedecin() {
  const navigate = useNavigate();

  const [inputMdp, setInputMdp] = useState("");
  const [idMedecin, setIdMedecin] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  // Fonction appelée lors de la tentative de connexion
  const handleLogin = async () => {
    try {
      // Requête au serveur pour la connexion du médecin
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/login_medecin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          // Envoie l'id du medecin et son mot de passe
          body: JSON.stringify({ idMedecin, inputMdp }),
        }
      );

      // Erreur de connexion
      if (!response.ok) {
        throw new Error("Erreur de connexion");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("idMedecin", data.idMedecin);

      alert(data.message);
      navigate("/tableau_de_bord_medecin");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  // GERE LES REDIRECTIONS
  const handleCreateAccount = () => {
    navigate("/register_medecin");
  };

  const handleLogo = () => {
    navigate("/");
  };

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

      {/* CONTENT FORMULAIRE DE CONNEXION MALADE */}
      <div className="container-connexion-medecin container-connexion">
        <h2 className="sub-title">Connexion espace médecin</h2>

        <form action="" className="login-main-part">
          <label htmlFor="">Entrer votre identifiant</label>
          <input
            type="text"
            placeholder="CLIQUER ICI"
            value={idMedecin}
            onChange={(e) => setIdMedecin(e.target.value)}
          />

          <label htmlFor="">Entrer votre mot de passe</label>
          <input
            type="password"
            placeholder="CLIQUER ICI"
            value={inputMdp}
            onChange={(e) => setInputMdp(e.target.value)}
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

export default LoginMedecin;
