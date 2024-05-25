import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LearningPage from './LearningPage';

test('renders learning page and switches tabs', () => {
  render(<LearningPage />);
  expect(screen.getByText(/Algorithm Topics/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Algorithms/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/Quizzes/i)).toBeInTheDocument();

  fireEvent.click(screen.getByText(/Quizzes/i));
  expect(screen.getByText(/No quiz available/i)).toBeInTheDocument();
});

test('renders algorithm content when an algorithm is selected', () => {
  render(<LearningPage />);
  fireEvent.click(screen.getByText(/Insertion Sort/i));
  expect(screen.getByText(/Insertion Sort is a simple sorting algorithm/i)).toBeInTheDocument();
});

test('switches between description, code, and visualization', () => {
  render(<LearningPage />);
  fireEvent.click(screen.getByText(/Insertion Sort/i));

  fireEvent.click(screen.getByText(/Code/i));
  expect(screen.getByText(/def insertion_sort/i)).toBeInTheDocument();

  fireEvent.click(screen.getByText(/Visualization/i));
  expect(screen.getByTitle(/Insertion Sort Video/i)).toBeInTheDocument();
});
