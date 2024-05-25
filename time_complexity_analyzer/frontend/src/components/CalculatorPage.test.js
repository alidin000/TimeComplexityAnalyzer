import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CalculatorPage from './CalculatorPage';
import AxiosInstance from './Axios';

jest.mock('./Axios');

test('renders language selection dropdown', () => {
  render(<CalculatorPage isAuthenticated={true} currentUser="testUser" />);
  expect(screen.getByLabelText(/Language/i)).toBeInTheDocument();
});

test('changes language and updates code editor', () => {
  render(<CalculatorPage isAuthenticated={true} currentUser="testUser" />);
  fireEvent.change(screen.getByLabelText(/Language/i), { target: { value: 'Java' } });
  expect(screen.getByDisplayValue(/public boolean isSorted/i)).toBeInTheDocument();
});

test('handles Analyse button click and displays results', async () => {
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

  await waitFor(() => {
    expect(screen.getByText(/Overall Time Complexity/i)).toBeInTheDocument();
  });
});
