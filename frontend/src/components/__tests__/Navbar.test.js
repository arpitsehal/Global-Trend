import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import Navbar from '../Navbar';

// Mock the AuthContext
const mockUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com'
};

const MockNavbarWithUser = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    </BrowserRouter>
  );
};

// Mock the useAuth hook
jest.mock('../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../contexts/AuthContext'),
  useAuth: () => ({
    user: mockUser,
    logout: jest.fn()
  })
}));

describe('Navbar Component', () => {
  test('renders logo and brand name', () => {
    render(<MockNavbarWithUser />);
    
    expect(screen.getByText('TaskMaster')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /TaskMaster/i })).toBeInTheDocument();
  });

  test('shows navigation items when user is logged in', () => {
    render(<MockNavbarWithUser />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  test('shows user information when logged in', () => {
    render(<MockNavbarWithUser />);
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('toggles mobile menu', () => {
    render(<MockNavbarWithUser />);
    
    // Find mobile menu button
    const menuButton = screen.getByRole('button', { name: /menu/i });
    
    // Initially mobile menu should be closed
    expect(screen.queryByText('Dashboard')).not.toBeVisible();
    
    // Click to open mobile menu
    fireEvent.click(menuButton);
    
    // Now mobile menu items should be visible
    expect(screen.getByText('Dashboard')).toBeVisible();
    
    // Click to close mobile menu
    fireEvent.click(menuButton);
    
    // Mobile menu should be closed again
    expect(screen.queryByText('Dashboard')).not.toBeVisible();
  });

  test('highlights active navigation item', () => {
    // Mock window.location
    delete window.location;
    window.location = { pathname: '/dashboard' };
    
    render(<MockNavbarWithUser />);
    
    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink.closest('a')).toHaveClass('text-primary-600');
  });
});
