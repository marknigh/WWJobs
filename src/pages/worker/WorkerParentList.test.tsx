import { render, screen, waitFor } from '@testing-library/react';
import WorkerParentList from './WorkerParentList';
import { db } from '@/lib/firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import React from 'react';

// Mock Firebase Firestore methods
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock('@/components/SpinnerCircle', () => () => <div>Loading...</div>);
jest.mock('@/components/ErrorDisplay', () => ({ code, message }: any) => (
  <div>
    <div>Error Code: {code}</div>
    <div>Error Message: {message}</div>
  </div>
));
jest.mock('@/components/ParentDetailsDialog', () => ({ parent }: any) => (
  <div>Parent: {parent.name}</div>
));

describe('WorkerParentList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<WorkerParentList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state when fetching fails', async () => {
    (getDocs as jest.Mock).mockRejectedValueOnce({
      code: 'failed-precondition',
    });

    render(<WorkerParentList />);

    await waitFor(() => {
      expect(
        screen.getByText('Error Code: failed-precondition')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Error Message: Failed to load parents. Please try again.'
        )
      ).toBeInTheDocument();
    });
  });

  it('renders parent list when data is fetched successfully', async () => {
    const mockParents = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ];
    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: mockParents.map((parent) => ({
        id: parent.id,
        data: () => parent,
      })),
    });

    render(<WorkerParentList />);

    await waitFor(() => {
      expect(screen.getByText('Parent: John Doe')).toBeInTheDocument();
      expect(screen.getByText('Parent: Jane Smith')).toBeInTheDocument();
    });
  });

  it('renders parent list with additional details when data is fetched successfully', async () => {
    const mockParents = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        address: '123 Main St, Springfield',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '987-654-3210',
        address: '456 Elm St, Shelbyville',
      },
    ];
    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: mockParents.map((parent) => ({
        id: parent.id,
        data: () => parent,
      })),
    });

    render(<WorkerParentList />);

    await waitFor(() => {
      expect(screen.getByText('Parent: John Doe')).toBeInTheDocument();
      expect(screen.getByText('Email: john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Phone: 123-456-7890')).toBeInTheDocument();
      expect(
        screen.getByText('Address: 123 Main St, Springfield')
      ).toBeInTheDocument();

      expect(screen.getByText('Parent: Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Email: jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('Phone: 987-654-3210')).toBeInTheDocument();
      expect(
        screen.getByText('Address: 456 Elm St, Shelbyville')
      ).toBeInTheDocument();
    });
  });
});
