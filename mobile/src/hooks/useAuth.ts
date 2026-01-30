import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apolloClient } from '../services/apollo-client';

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  profileId?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      const userJson = await SecureStore.getItemAsync('user');
      if (token && userJson) {
        const user = JSON.parse(userJson);
        setState({ user, token, isLoading: false, isAuthenticated: true });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signIn = useCallback(async (accessToken: string, refreshToken: string, user: AuthUser) => {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    await SecureStore.setItemAsync('user', JSON.stringify(user));
    setState({ user, token: accessToken, isLoading: false, isAuthenticated: true });
  }, []);

  const signOut = useCallback(async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('user');
    await apolloClient.clearStore();
    setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
  }, []);

  const updateUser = useCallback(async (user: AuthUser) => {
    await SecureStore.setItemAsync('user', JSON.stringify(user));
    setState(prev => ({ ...prev, user }));
  }, []);

  return { ...state, signIn, signOut, updateUser };
}
