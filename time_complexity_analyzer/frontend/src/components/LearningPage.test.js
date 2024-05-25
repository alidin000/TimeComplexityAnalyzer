import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LearningPage from './LearningPage';

test('renders learning page and switches tabs', async () => {
  render(<LearningPage />);
  expect(screen.getByText(/Algorithm Topics/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Algorithms/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/Quizzes/i)).toBeInTheDocument();

  fireEvent.click(screen.getByText(/Quizzes/i));
  expect(await screen.findByText(/No quiz available/i)).toBeInTheDocument();
});

test('renders algorithm content when an algorithm is selected', async () => {
  render(<LearningPage />);
  fireEvent.click(screen.getByText(/Insertion Sort/i, { selector: 'button' }));
  expect(await screen.findByText(/Insertion Sort is a simple sorting algorithm/i)).toBeInTheDocument();
});

test('switches between description, code, and visualization', async () => {
  render(<LearningPage />);
  
  fireEvent.click(screen.getByText(/Insertion Sort/i, { selector: 'button' }));
  
  fireEvent.click(screen.getByText(/Code/i, { selector: 'button' }));
  expect(await screen.findByText(/def insertion_sort/i)).toBeInTheDocument();
});
