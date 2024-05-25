import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';

test('renders Header component and navigates', () => {
  render(
    <Router>
      <Header isLoggedIn={false} />
    </Router>
  );

  expect(screen.getAllByText(/CALCULATOR/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/LEARNING/i)).toBeInTheDocument();
  expect(screen.getByText(/ABOUT US/i)).toBeInTheDocument();
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});
