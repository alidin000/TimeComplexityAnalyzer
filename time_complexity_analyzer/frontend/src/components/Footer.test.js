import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

test('renders footer text', () => {
  render(<Footer />);
  expect(screen.getByText(/© TimeComplexity™ 2024/i)).toBeInTheDocument();
});

test('renders footer links', () => {
  render(<Footer />);
  expect(screen.getByText(/About/i)).toBeInTheDocument();
  expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
  expect(screen.getByText(/Licensing/i)).toBeInTheDocument();
  expect(screen.getByText(/Contact/i)).toBeInTheDocument();
});
