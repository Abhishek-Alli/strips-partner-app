import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { User } from '../types/auth.types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.fincal.sbs/api';

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000
});

// Add access token to auth API requests (except login/refresh endpoints)
authApi.interceptors.request.use(async (config) => {
  // Don't add token to login, refresh, or OTP endpoints
  if (!config.url?.includes('/login') && 
      !config.url?.includes('/refresh') && 
      !config.url?.includes('/otp')) {
    const token = await AsyncStorage.getItem('@auth_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  private readonly ACCESS_TOKEN_KEY = '@auth_access_token';
  private readonly REFRESH_TOKEN_KEY = '@auth_refresh_token';
  private readonly USER_KEY = '@auth_user';

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await authApi.post<LoginResponse>('/login', credentials);
    await this.setAuthData(response.data);
    return response.data;
  }

  async refreshAccessToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await authApi.post<LoginResponse>('/refresh', { refreshToken });
    await this.setAuthData(response.data);
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken
    };
  }

  async sendOTP(phone: string): Promise<void> {
    await authApi.post('/otp/send', { phone });
  }

  async verifyOTP(phone: string, otp: string): Promise<LoginResponse> {
    const response = await authApi.post<LoginResponse>('/otp/verify', { phone, otp });
    await this.setAuthData(response.data);
    return response.data;
  }

  async register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    referralCode?: string;
  }): Promise<void> {
    await authApi.post('/register', data);
  }

  async verifyRegistrationOTP(email: string, phone: string, otp: string): Promise<LoginResponse> {
    const response = await authApi.post<LoginResponse>('/register/verify-otp', {
      email,
      phone,
      otp
    });
    await this.setAuthData(response.data);
    return response.data;
  }

  async sendRegistrationOTP(email: string, phone: string): Promise<void> {
    await authApi.post('/register/send-otp', { email, phone });
  }

  async requestPasswordReset(email: string): Promise<void> {
    await authApi.post('/forgot-password', { email });
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    await authApi.post('/reset-password', { email, otp, newPassword });
  }

  async registerWithSocial(data: {
    name: string;
    email: string;
    phone: string;
    role: string;
    referralCode?: string;
    socialId: string;
    provider: 'google' | 'facebook';
  }): Promise<void> {
    await authApi.post('/register/social', data);
  }

  /**
   * Social login — verify provider token with backend.
   * Returns either a full LoginResponse (existing user) or
   * { newUser: true, profile } for users who still need to register.
   */
  async socialLogin(
    provider: 'google' | 'facebook',
    idToken: string,
  ): Promise<LoginResponse | { newUser: true; profile: { email: string; name: string; picture?: string } }> {
    const endpoint = provider === 'google' ? '/social/google' : '/social/facebook';
    const body = provider === 'google' ? { idToken } : { accessToken: idToken };
    const response = await authApi.post(endpoint, body);
    if (response.data.newUser) {
      return response.data as { newUser: true; profile: { email: string; name: string; picture?: string } };
    }
    await this.setAuthData(response.data as LoginResponse);
    return response.data as LoginResponse;
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove([
      this.ACCESS_TOKEN_KEY,
      this.REFRESH_TOKEN_KEY,
      this.USER_KEY
    ]);
  }

  async getStoredAuth(): Promise<{ accessToken: string | null; refreshToken: string | null; user: User | null }> {
    const [accessToken, refreshToken, userStr] = await AsyncStorage.multiGet([
      this.ACCESS_TOKEN_KEY,
      this.REFRESH_TOKEN_KEY,
      this.USER_KEY
    ]);
    return {
      accessToken: accessToken[1],
      refreshToken: refreshToken[1],
      user: userStr[1] ? JSON.parse(userStr[1]) : null
    };
  }

  async getAccessToken(): Promise<string | null> {
    const [result] = await AsyncStorage.multiGet([this.ACCESS_TOKEN_KEY]);
    return result[1];
  }

  async getRefreshToken(): Promise<string | null> {
    const [result] = await AsyncStorage.multiGet([this.REFRESH_TOKEN_KEY]);
    return result[1];
  }

  private async setAuthData(data: LoginResponse): Promise<void> {
    await AsyncStorage.multiSet([
      [this.ACCESS_TOKEN_KEY, data.accessToken],
      [this.REFRESH_TOKEN_KEY, data.refreshToken],
      [this.USER_KEY, JSON.stringify(data.user)]
    ]);
  }
}

export const authService = new AuthService();



