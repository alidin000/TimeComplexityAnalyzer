import React from 'react';
import { render, screen } from '@testing-library/react';
import InfoSection from './InfoSection';

const limitations = ["No decorators", "Only one function should be present"];

test('renders limitations for the selected language', () => {
  render(<InfoSection language="Python" limitations={limitations} />);
  expect(screen.getByText(/Limitations for Python/i)).toBeInTheDocument();
  expect(screen.getByText(/No decorators/i)).toBeInTheDocument();
  expect(screen.getByText(/Only one function should be present/i)).toBeInTheDocument();
});
