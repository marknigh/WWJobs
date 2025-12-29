import { render, screen } from '@testing-library/react';
import ErrorDisplay from './ErrorDisplay';

describe('ErrorDisplay', () => {
  it('renders the error code and message', () => {
    render(<ErrorDisplay code="404" message="Page not found" />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('renders another error code and message', () => {
    render(<ErrorDisplay code="500" message="Internal server error" />);

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Internal server error')).toBeInTheDocument();
  });
});
