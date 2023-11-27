import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import RegisterMalade from "../pages/register/registerMalade";
import RegisterMedecin from "../pages/register/registerMedecin";
import RegisterProche from "../pages/register/registerProche";

describe("renders login", () => {
    // REGISTER MALADE
    it("register malade", () => {
        cy.mount(
            <Router>
                <RegisterMalade />
            </Router>
        );
    });

    // REGISTER MEDECIN
    it("register médecin", () => {
        cy.mount(
            <Router>
                <RegisterMedecin />
            </Router>
        );
    });

    // REGISTER PROCHE
    it("register proche", () => {
        cy.mount(
            <Router>
                <RegisterProche />
            </Router>
        );
    });
});
