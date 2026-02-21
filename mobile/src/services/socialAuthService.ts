/**
 * Social Authentication Service
 *
 * Handles Google and Facebook OAuth.
 * In mock/dev mode returns stub data so the app runs without real OAuth credentials.
 *
 * Production setup — after installing packages:
 *   npx expo install expo-auth-session expo-crypto expo-web-browser
 *   Then uncomment the sections marked [PROD].
 */

import { logger } from '../core/logger';
import { env } from '../core/env/config';

// [PROD] Uncomment once expo-auth-session is installed:
// import * as Google from 'expo-auth-session/providers/google';
// import * as Facebook from 'expo-auth-session/providers/facebook';
// import * as WebBrowser from 'expo-web-browser';
// WebBrowser.maybeCompleteAuthSession();

export interface SocialUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  provider: 'google' | 'facebook';
  /** Raw OAuth token — send to backend /api/auth/social/{provider} for verification */
  idToken?: string;
}

class SocialAuthService {
  private get shouldUseMock() {
    return env.useMock || env.mode === 'development';
  }

  // ── Google ──────────────────────────────────────────────────────────────────

  async signInWithGoogle(): Promise<SocialUser> {
    if (this.shouldUseMock) {
      return {
        id:      'google_mock_123',
        name:    'Mock Google User',
        email:   'mock.google@example.com',
        provider: 'google',
        idToken: 'mock_google_id_token',
      };
    }

    // [PROD] Replace with real OAuth flow once expo-auth-session is installed:
    // const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID ?? '';
    // ... use Google.useAuthRequest / promptAsync to get idToken
    // Then return { id, name, email, provider: 'google', idToken }

    throw new Error(
      'Google Sign-In requires expo-auth-session.\n' +
      'Run: npx expo install expo-auth-session expo-crypto expo-web-browser',
    );
  }

  // ── Facebook ─────────────────────────────────────────────────────────────────

  async signInWithFacebook(): Promise<SocialUser> {
    if (this.shouldUseMock) {
      return {
        id:      'facebook_mock_123',
        name:    'Mock Facebook User',
        email:   'mock.facebook@example.com',
        provider: 'facebook',
        idToken: 'mock_facebook_access_token',
      };
    }

    // [PROD] Replace with real OAuth flow once expo-auth-session is installed:
    // const FACEBOOK_APP_ID = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID ?? '';
    // ... use Facebook.useAuthRequest / promptAsync to get accessToken

    throw new Error(
      'Facebook Login requires expo-auth-session.\n' +
      'Run: npx expo install expo-auth-session expo-crypto expo-web-browser',
    );
  }

  // ── Sign out ─────────────────────────────────────────────────────────────────

  async signOut(): Promise<void> {
    try {
      // [PROD] Call provider-specific sign-out SDK if using native SDKs
    } catch (error) {
      logger.error('Social sign out error', error as Error);
    }
  }
}

export const socialAuthService = new SocialAuthService();
