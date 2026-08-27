import { Platform } from 'react-native';

/**
 * Mobile Environment & Network Configuration.
 * Centralized resolution of API and Socket URLs with platform fallbacks.
 */

function getDevApiUrl(): string {
  if (Platform.OS === 'android') {
    // Android emulator connects to host machine via 10.0.2.2
    return 'http://10.0.2.2:8000/api/v1';
  }
  return 'http://localhost:8000/api/v1';
}

function getDevSocketUrl(): string {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }
  return 'http://localhost:8000';
}

export const Config = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || getDevApiUrl(),
  SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL || getDevSocketUrl(),
  APP_NAME: 'Dewasi Group',
  TOKEN_KEY: 'dewasi_access_token',
  REFRESH_TOKEN_KEY: 'dewasi_refresh_token',
  USER_KEY: 'dewasi_auth_user',
} as const;
