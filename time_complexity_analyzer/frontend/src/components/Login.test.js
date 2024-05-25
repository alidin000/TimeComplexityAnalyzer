import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Login';

test('renders Login component and handles login', () => {
  render(
    <Router>
      <Login handleLogin={jest.fn()} />
    </Router>
  );

  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testUser' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'testPassword' } });

  fireEvent.click(screen.getByText(/Submit/i));

  expect(screen.getByText(/Please try again/i)).toBeInTheDocument();
});
