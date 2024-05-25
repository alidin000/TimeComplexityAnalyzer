import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';

test('renders header links when not logged in', () => {
  render(
    <Router>
      <Header isLoggedIn={false} />
    </Router>
  );

  expect(screen.getByRole('link', { name: /CALCULATOR/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /LEARNING/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /ABOUT US/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Sign Up/i })).toBeInTheDocument();
});

test('renders header links when logged in', () => {
  render(
    <Router>
      <Header isLoggedIn={true} />
    </Router>
  );

  expect(screen.getByRole('link', { name: /CALCULATOR/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /LEARNING/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /ABOUT US/i })).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText(/account of current user/i));
  expect(screen.getByRole('menuitem', { name: /Logout/i })).toBeInTheDocument();
});
