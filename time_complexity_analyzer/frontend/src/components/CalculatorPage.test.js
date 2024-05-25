import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CalculatorPage from './CalculatorPage';
import AxiosInstance from './Axios';

jest.mock('./Axios');

test('renders CalculatorPage component and changes language', () => {
  render(<CalculatorPage isAuthenticated={true} currentUser="testUser" />);
  
  expect(screen.getByLabelText(/Language/i)).toBeInTheDocument();
  
  fireEvent.change(screen.getByLabelText(/Language/i), { target: { value: 'Java' } });
  expect(screen.getByDisplayValue(/Java/i)).toBeInTheDocument();
});

test('handles Analyse button click', async () => {
  AxiosInstance.post.mockResolvedValue({
    data: {
      lines: {
        1: { model: 'constant' },
        2: { model: 'linear' }
      },
      function: { model: 'linear' }
    }
  });

  render(<CalculatorPage isAuthenticated={true} currentUser="testUser" />);
  
  fireEvent.click(screen.getByText(/Analyse/i));
  
  expect(await screen.findByText(/Overall Function Time Complexity/i)).toBeInTheDocument();
});
