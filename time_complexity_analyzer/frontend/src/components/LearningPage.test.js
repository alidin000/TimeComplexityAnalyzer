import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LearningPage from './LearningPage';

test('renders learning page and switches tabs', async () => {
  render(<LearningPage />);
  expect(screen.getByText(/Algorithm Topics/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Algorithms/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/Quizzes/i)).toBeInTheDocument();

  fireEvent.click(screen.getByText(/Quizzes/i));
  expect(await screen.findByText(/SUBMIT/i)).toBeInTheDocument();
});

test('renders algorithm topics', () => {
  render(<LearningPage />);
  expect(screen.getByText(/Algorithm Topics/i)).toBeInTheDocument();
});

test('navigates between algorithm description, code, and visualization', () => {
  render(<LearningPage />);
  fireEvent.click(screen.getByText(/DESCRIPTION/i));
  expect(screen.getByText(/Learn more/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Code/i));
  expect(screen.getByText(/Python/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Visualization/i));
  expect(screen.getByText(/Visualization/i)).toBeInTheDocument();
});
