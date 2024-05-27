import React from 'react';
import { render, screen } from '@testing-library/react';
import Output from './CodeOut';

test('renders Output component with results', () => {
  const results = [
    { line: 'def find_max(arr):', complexity: 'constant', notation: 'O(1)', avgExecTimes: { 100: 0.1 } },
    { line: 'max_value = arr[0]', complexity: 'linear', notation: 'O(n)', avgExecTimes: { 100: 0.2 } }
  ];

  render(<Output outputText="// Output will be displayed here" results={results} />);

  expect(screen.getByText(/def find_max/i)).toBeInTheDocument();
  expect(screen.getByText(/max_value = arr\[0\]/i)).toBeInTheDocument();
});

test('renders output sections', () => {
  render(<Output outputText="Test output" results={[]} error="" />);
  expect(screen.getByText(/Line-by-Line Analysis/i)).toBeInTheDocument();
});

test('displays error message', () => {
  render(<Output outputText="" results={[]} error="Test error" />);
  expect(screen.getByText(/Can't calculate it. Please check your code and try again./i)).toBeInTheDocument();
});

test('displays analysis results', () => {
  const results = [{ line: 'line of code', complexity: 'constant', notation: 'O(1)', avgExecTimes: { 100: 0.1 } }];
  render(<Output outputText="" results={results} error="" />);
  expect(screen.getByText(/line of code/i)).toBeInTheDocument();
  expect(screen.getByText(/100: 0.10 ns/i)).toBeInTheDocument();
});
