import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutUs from './AboutUs';

test('renders About Us heading', () => {
  render(<AboutUs />);
  expect(screen.getByText(/About Us/i)).toBeInTheDocument();
});

test('renders About Us paragraphs', () => {
  render(<AboutUs />);
  expect(screen.getByText(/Welcome to our platform!/i)).toBeInTheDocument();
  expect(screen.getByText(/On our Learning Page/i)).toBeInTheDocument();
  expect(screen.getByText(/Utilize our Calculator Page/i)).toBeInTheDocument();
  expect(screen.getByText(/Please note that our tool/i)).toBeInTheDocument();
});

test('renders embedded video', () => {
  render(<AboutUs />);
  expect(screen.getByTitle(/Time Complexity Animations/i)).toBeInTheDocument();
});
