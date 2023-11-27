import "../composantsCss/App.scss";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import LoginMalade from "../pages/login/LoginMalade";
import LoginProche from "../pages/login/LoginProche";
import LoginMedecin from "../pages/login/LoginMedecin";
import RegisterMalade from "../pages/register/registerMalade";
import RegisterProche from "../pages/register/registerProche";
import RegisterMedecin from "../pages/register/registerMedecin";
import TableauDeBordMalade from "../pages/tableauDeBord/tableauDeBordMalade";
import TableauDeBordMedecin from "../pages/tableauDeBord/tableauDeBordMedecin";
import TableauDeBordProche from "../pages/tableauDeBord/tableauDeBordProche";
import DetailsPatient from "../pages/tableauDeBord/details/detaitPatient";
import DetailsMalade from "../pages/tableauDeBord/details/detaitMalade";
import HistoriqueMalade from "../pages/tableauDeBord/historique/historiqueMalade";
import EConsultation from "../pages/tableauDeBord/eConsultation/eConsultation";
import Renseignements from "../pages/tableauDeBord/renseignements/renseignements";
import Urgence from "../pages/tableauDeBord/urgence/urgence";
import ResultatsConsultation from "../pages/tableauDeBord/eConsultation/ResultatsConsultation.jsx";
import DetailsMaladeProche from "../pages/tableauDeBord/details/detaitMaladeProche";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login_malade" element={<LoginMalade />} />
        <Route path="/login_proche" element={<LoginProche />} />
        <Route path="/login_medecin" element={<LoginMedecin />} />
        <Route path="/register_malade" element={<RegisterMalade />} />
        <Route path="/register_proche" element={<RegisterProche />} />
        <Route path="/register_medecin" element={<RegisterMedecin />} />
        <Route
          path="/tableau_de_bord_malade"
          element={<TableauDeBordMalade />}
        />
        <Route
          path="/tableau_de_bord_proche"
          element={<TableauDeBordProche />}
        />
        <Route
          path="/tableau_de_bord_medecin"
          element={<TableauDeBordMedecin />}
        />
        <Route path="/details_malade" element={<DetailsMalade />} />
        <Route path="/details_patient" element={<DetailsPatient />} />
        <Route path="/historique" element={<HistoriqueMalade />} />
        <Route path="/econsultation" element={<EConsultation />} />
        <Route path="/renseignements" element={<Renseignements />} />
        <Route path="/urgence" element={<Urgence />} />
        <Route path="/details_patient/:utilisateur_id" element={<DetailsPatient />} />
        <Route path="/resultat_consultation" element={<ResultatsConsultation />} />
        <Route path="/details_malade_proche/:utilisateur_id" element={<DetailsMaladeProche />} />
      </Routes>
    </>
  );
}

export default App;
