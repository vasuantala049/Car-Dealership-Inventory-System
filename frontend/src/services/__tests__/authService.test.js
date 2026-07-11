import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { login, register } from '../../services/authService';

vi.mock('axios');

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('login', () => {
    it('returns token on success', async () => {
      axios.post.mockResolvedValueOnce({ data: { token: 'jwt-token-abc' } });

      const result = await login('user@example.com', 'password123');

      expect(axios.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'user@example.com',
        password: 'password123',
      });
      expect(result).toEqual({ token: 'jwt-token-abc' });
    });

    it('throws on invalid credentials (401)', async () => {
      const error = { response: { status: 401 } };
      axios.post.mockRejectedValueOnce(error);

      await expect(login('bad@example.com', 'wrongpass')).rejects.toEqual(error);
    });
  });

  describe('register', () => {
    it('returns user on success', async () => {
      axios.post.mockResolvedValueOnce({ data: { id: 1, email: 'new@example.com' } });

      const result = await register('new@example.com', 'password123');

      expect(axios.post).toHaveBeenCalledWith('/api/auth/register', {
        email: 'new@example.com',
        password: 'password123',
      });
      expect(result).toEqual({ id: 1, email: 'new@example.com' });
    });

    it('throws on duplicate email (409)', async () => {
      const error = { response: { status: 409 } };
      axios.post.mockRejectedValueOnce(error);

      await expect(register('existing@example.com', 'password123')).rejects.toEqual(error);
    });
  });
});
