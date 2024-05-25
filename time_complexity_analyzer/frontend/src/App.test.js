import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders Calculator page by default', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Calculator/i)).toBeInTheDocument();
});

test('renders Learning page when navigated to /learning', () => {
  render(
    <MemoryRouter initialEntries={['/learning']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Algorithm Topics/i)).toBeInTheDocument();
});

test('renders Login page when navigated to /login', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});

test('renders Signup page when navigated to /signup', () => {
  render(
    <MemoryRouter initialEntries={['/signup']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
});

test('renders About Us page when navigated to /about-us', () => {
  render(
    <MemoryRouter initialEntries={['/about-us']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/About Us/i)).toBeInTheDocument();
});
