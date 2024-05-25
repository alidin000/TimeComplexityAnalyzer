import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Signup from './SignUp';

test('renders signup form', () => {
  render(
    <Router>
      <Signup />
    </Router>
  );

  expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/E-Mail/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  expect(screen.getByText(/Submit/i)).toBeInTheDocument();
});

test('handles signup submission', async () => {
  render(
    <Router>
      <Signup />
    </Router>
  );

  fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'testUser' } });
  fireEvent.change(screen.getByLabelText(/E-Mail/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'testPassword' } });
  fireEvent.click(screen.getByText(/Submit/i));

  // Assuming the signup process will navigate elsewhere on success
  expect(await screen.findByText(/Please try again/i)).toBeInTheDocument();
});
