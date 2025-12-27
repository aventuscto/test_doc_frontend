import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from '../components/Login';

// Mock api
vi.mock('../api', () => ({
    default: {
        post: vi.fn(),
    },
}));

import api from '../api';

describe('Login Component', () => {
    it('renders login form', () => {
        render(<Login onLogin={() => { }} />);
        expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
    });

    it('handles input changes', () => {
        render(<Login onLogin={() => { }} />);
        const usernameInput = screen.getByPlaceholderText('Enter username');
        const passwordInput = screen.getByPlaceholderText('Enter password');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(usernameInput.value).toBe('testuser');
        expect(passwordInput.value).toBe('password123');
    });
});
