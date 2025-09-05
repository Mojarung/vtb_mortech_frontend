const API_BASE_URL = 'https://mojarung-vtb-mortech-backend-b77e.twc1.net';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'hr' | 'user';
  full_name?: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: 'hr' | 'user';
  full_name?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('🌐 API Client: Making request to:', url);
    console.log('🌐 API Client: Options:', options);
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Важно для отправки куки
    };

    console.log('🌐 API Client: Final config:', config);

    const response = await fetch(url, config);
    
    console.log('🌐 API Client: Response status:', response.status);
    console.log('🌐 API Client: Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API Client: Request failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Client: Request successful:', data);
    return data;
  }

  async login(credentials: LoginRequest): Promise<TokenResponse> {
    return this.request<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<User> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async logout(): Promise<void> {
    // Делаем запрос на сервер для удаления HttpOnly куки
    try {
      await this.request<void>('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Даже если запрос не удался, продолжаем с очисткой локального состояния
      console.warn('Logout request failed:', error);
    }
  }

  // Методы для получения данных dashboard
  async getCandidateStats(): Promise<any> {
    return this.request<any>('/candidate/stats');
  }

  async getCandidateInterviews(): Promise<any> {
    return this.request<any>('/candidate/interviews');
  }

  async getHRStats(): Promise<any> {
    return this.request<any>('/hr/stats');
  }

  async getHRInterviews(): Promise<any> {
    return this.request<any>('/hr/interviews');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
