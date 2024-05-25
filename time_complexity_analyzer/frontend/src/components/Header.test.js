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

  expect(screen.getByText(/CALCULATOR/i)).toBeInTheDocument();
  expect(screen.getByText(/LEARNING/i)).toBeInTheDocument();
  expect(screen.getByText(/ABOUT US/i)).toBeInTheDocument();
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
  expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
});

test('renders header links when logged in', () => {
  render(
    <Router>
      <Header isLoggedIn={true} />
    </Router>
  );

  expect(screen.getByText(/CALCULATOR/i)).toBeInTheDocument();
  expect(screen.getByText(/LEARNING/i)).toBeInTheDocument();
  expect(screen.getByText(/ABOUT US/i)).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText(/account of current user/i));
  expect(screen.getByText(/Logout/i)).toBeInTheDocument();
});
