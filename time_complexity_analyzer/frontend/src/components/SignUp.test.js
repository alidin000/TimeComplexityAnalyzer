import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Signup from './SignUp';

test('renders Signup component and handles signup', () => {
  render(
    <Router>
      <Signup />
    </Router>
  );

  fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'testUser' } });
  fireEvent.change(screen.getByLabelText(/E-Mail/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'testPassword' } });

  fireEvent.click(screen.getByText(/Submit/i));

  expect(screen.getByText(/Please try again/i)).toBeInTheDocument();
});
