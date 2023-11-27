import { useNavigate } from "react-router-dom";
import "../composantsCss/home.scss";
import imgLogo from "../public/assets/Logo_MedECare_LightV.png";

function Home() {
  const navigate = useNavigate();

  const handleLoginMalade = () => {
    // Rediriger vers l'URL "/login_malade"
    navigate("/login_malade");
  };

  const handleLoginProche = () => {
    // Rediriger vers l'URL "/login_proche"
    navigate("/login_proche");
  };

  const handleLoginMedecin = () => {
    // Rediriger vers l'URL "/login_malade"
    navigate("/login_medecin");
  };

  const handleLogo = () => {
    // Rediriger vers l'URL "/login_malade"
    navigate("/");
  };

  return (
    <>
      <div className="big-title" onClick={handleLogo}>
        <img
            src={imgLogo}
            alt="Logo de l'application"
          className="app-logo"
        />
        <h1 className="title">MedECare</h1>
      </div>
      <div className="container-home">
        <div
          className="container-espace-proche container-espace"
          onClick={handleLoginProche}
        >
          <div className="container-background-proche container-background">
            ESPACE PROCHE
          </div>
        </div>
        <div
          className="container-espace-malade container-espace"
          onClick={handleLoginMalade}
        >
          <div className="container-background-malade container-background">
            ESPACE MALADE
          </div>
        </div>
        <div
          className="container-espace-medecin container-espace"
          onClick={handleLoginMedecin}
        >
          <div className="container-background-medecin container-background">
            ESPACE MÉDECIN
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
