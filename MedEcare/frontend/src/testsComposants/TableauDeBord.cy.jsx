import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import TableauDeBordMalade from "../pages/tableauDeBord/tableauDeBordMalade";
import TableauDeBordMedecin from "../pages/tableauDeBord/tableauDeBordMedecin";
import TableauDeBordProche from "../pages/tableauDeBord/tableauDeBordProche";

describe("renders login", () => {
    // TABLEAU DE BORD MALADE
    it("tableau de bord malade", () => {
        cy.mount(
            <Router>
                <TableauDeBordMalade />
            </Router>
        );
    });

    // TABLEAU DE BORD MEDECIN
    it("tableau de bord médecin", () => {
        cy.mount(
            <Router>
                <TableauDeBordMedecin />
            </Router>
        );
    });

    // TABLEAU DE BORD PROCHE
    it("tableau de bord proche", () => {
        cy.mount(
            <Router>
                <TableauDeBordProche />
            </Router>
        );
    });
});
