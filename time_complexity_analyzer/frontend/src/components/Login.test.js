import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Login';

test('renders login form', () => {
  render(
    <Router>
      <Login handleLogin={jest.fn()} />
    </Router>
  );

  expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  expect(screen.getByText(/Submit/i)).toBeInTheDocument();
});

test('handles login submission', async () => {
  render(
    <Router>
      <Login handleLogin={jest.fn()} />
    </Router>
  );

  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testUser' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'testPassword' } });
  fireEvent.click(screen.getByText(/Submit/i));

  // Assuming you handle login and navigate elsewhere
  expect(await screen.findByText(/Please try again/i)).toBeInTheDocument();
});
