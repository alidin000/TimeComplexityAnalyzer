// src/components/Login.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Login';
import AxiosInstance from './Axios';
import MockAdapter from 'axios-mock-adapter';

describe('Login Component', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(AxiosInstance);
  });

  afterEach(() => {
    mock.reset();
  });

  it('renders login form', () => {
    render(
      <Router>
        <Login handleLogin={jest.fn()} />
      </Router>
    );

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });

  it('handles login submission', async () => {
    mock.onPost('/login/').reply(200, { token: 'fake_token' });

    render(
      <Router>
        <Login handleLogin={jest.fn()} />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'testPassword' } });
    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(screen.queryByText(/Please try again/i)).not.toBeInTheDocument();
    });
  });
});
