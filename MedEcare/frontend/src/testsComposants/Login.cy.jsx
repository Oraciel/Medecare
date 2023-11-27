import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import LoginMalade from "../pages/login/LoginMalade.jsx";
import LoginMedecin from "../pages/login/LoginMedecin.jsx";
import LoginProche from "../pages/login/LoginProche.jsx";

describe("renders login", () => {
  // LOGIN MALADE
  it("login malade", () => {
    cy.mount(
      <Router>
        <LoginMalade />
      </Router>
    );
    cy.get("h1").should("contain", "MedECare");
    cy.get("input").should(
      "have.attr",
      "placeholder",
      "Entrer votre numéro de carte vitale"
    );
  });

  // LOGIN MEDECIN
  it("login médecin", () => {
    cy.mount(
      <Router>
        <LoginMedecin />
      </Router>
    );
  });

  // LOGIN PROCHE
  it("login proche", () => {
    cy.mount(
      <Router>
        <LoginProche />
      </Router>
    );
  });
});
