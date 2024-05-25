import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LearningPage from './LearningPage';

test('renders LearningPage component and switches tabs', () => {
  render(<LearningPage />);

  expect(screen.getByText(/Algorithm Topics/i)).toBeInTheDocument();

  expect(screen.getAllByText(/Algorithms/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/Quizzes/i)).toBeInTheDocument();

  fireEvent.click(screen.getByText(/Quizzes/i));
  expect(screen.getByText(/No quiz available/i)).toBeInTheDocument();
});
