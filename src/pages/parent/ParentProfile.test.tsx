import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ParentProfile from './ParentProfile';
import useFirebaseAuth from '@/hooks/use-auth-state-change';
import { getDoc, updateDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import '@testing-library/jest-dom'; // Mock Firebase and Toast
jest.mock('@/hooks/use-auth-state-change', () => ({
  useFirebaseAuth: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
}));
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}));

describe('ParentProfile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the loading spinner when loading is true', () => {
    (useFirebaseAuth as jest.Mock).mockReturnValue({
      authUser: null,
      authLoading: true,
    });

    render(<ParentProfile />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders the form when loading is false', async () => {
    (useFirebaseAuth as jest.Mock).mockReturnValue({
      authUser: { uid: 'test-user-id' },
      authLoading: false,
    });

    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({
        email: 'test@example.com',
        name: 'Test User',
        address: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        zip: '12345',
        phone: '123-456-7890',
        baby: true,
        pet: false,
        home: true,
        children: '2',
        pets: '1',
      }),
    });

    render(<ParentProfile />);

    // Wait for the form to render
    await waitFor(() => {
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    // Check that form fields are populated
    expect(screen.getByPlaceholderText('Your email')).toHaveValue(
      'test@example.com'
    );
    expect(screen.getByPlaceholderText('Your full name')).toHaveValue(
      'Test User'
    );
    expect(screen.getByPlaceholderText('Your address')).toHaveValue(
      '123 Test St'
    );
    expect(screen.getByPlaceholderText('Your city')).toHaveValue('Test City');
    expect(screen.getByPlaceholderText('Your state')).toHaveValue('Test State');
    expect(screen.getByPlaceholderText('Your ZIP code')).toHaveValue('12345');
    expect(screen.getByPlaceholderText('Your phone number')).toHaveValue(
      '123-456-7890'
    );
    expect(screen.getByLabelText('Baby Care')).toBeChecked();
    expect(screen.getByLabelText('Pet Care')).not.toBeChecked();
    expect(screen.getByLabelText('Home Care')).toBeChecked();
  });

  it('updates form fields correctly', async () => {
    (useFirebaseAuth as jest.Mock).mockReturnValue({
      authUser: { uid: 'test-user-id' },
      authLoading: false,
    });

    render(<ParentProfile />);

    // Wait for the form to render
    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
    });

    // Update the name field
    const nameInput = screen.getByPlaceholderText('Your full name');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    expect(nameInput).toHaveValue('Updated Name');
  });

  it('submits the form with correct data', async () => {
    (useFirebaseAuth as jest.Mock).mockReturnValue({
      authUser: { uid: 'test-user-id' },
      authLoading: false,
    });

    (updateDoc as jest.Mock).mockResolvedValueOnce({});
    const mockToast = jest.fn();
    (toast as jest.Mock).mockReturnValue({ toast: mockToast });

    render(<ParentProfile />);

    // Wait for the form to render
    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
    });

    // Submit the form
    const submitButton = screen.getByText('Save');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          name: expect.any(String),
          email: expect.any(String),
        })
      );
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Profile Updated',
        })
      );
    });
  });
});
