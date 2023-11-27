import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '../pages/home';

describe('render home', () => {
  it('renders', () => {
    cy.mount(
      <Router>
        <Home />
      </Router>
    );
  });
});
