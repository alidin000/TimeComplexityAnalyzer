import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutUs from './AboutUs';

test('renders About Us component', () => {
  render(<AboutUs />);
  
  expect(screen.getByText(/About Us/i)).toBeInTheDocument();
  expect(screen.getByText(/Welcome to our platform!/i)).toBeInTheDocument();
  expect(screen.getByText(/A short video about Time Complexity/i)).toBeInTheDocument();
  expect(screen.getByTitle(/Time Complexity Animations/i)).toBeInTheDocument();
});
