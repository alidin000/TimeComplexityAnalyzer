import React from 'react';
import { render, screen } from '@testing-library/react';
import Output from './Output';

test('renders Output component with results', () => {
  const results = [
    { line: 'def find_max(arr):', complexity: 'constant', notation: 'O(1)' },
    { line: 'max_value = arr[0]', complexity: 'linear', notation: 'O(n)' }
  ];

  render(<Output outputText="// Output will be displayed here" results={results} />);

  expect(screen.getByText(/def find_max/i)).toBeInTheDocument();
  expect(screen.getByText(/max_value = arr\[0\]/i)).toBeInTheDocument();
  expect(screen.getByText(/Overall Time Complexity/i)).toBeInTheDocument();
});
