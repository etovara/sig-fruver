import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SIG-FRUVER title', () => {
  render(<App />);
  const titleElements = screen.getAllByText(/SIG-FRUVER/i);
  expect(titleElements.length).toBeGreaterThan(0);
});
