// Продакшн конфигурация
// Позволяем переопределять базовый URL через переменную окружения в Next.js
// В сборке Next переменные, начинающиеся с NEXT_PUBLIC_, попадают на клиент
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mojarung-vtb-mortech-backend-ef3c.twc1.net';

console.log('🌐 API Configuration:', { API_BASE_URL });

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'hr' | 'user';
  full_name?: string;
  position?: string;
  is_active: boolean;
  created_at: string;
  // Profile fields
  first_name?: string;
  last_name?: string;
  phone?: string;
  birth_date?: string;
  location?: string;
  about?: string;
  desired_salary?: number;
  ready_to_relocate?: boolean;
  employment_type?: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    period: string;
  }>;
  skills?: string[];
  work_experience?: Array<{
    company: string;
    position: string;
    period: string;
    description: string;
  }>;
  // Дополнительные поля, используемые в настройках кандидата
  preferred_position?: string;
  min_salary?: number;
  max_salary?: number;
  relocation?: string;
  employment_types?: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface Interview {
  id: number;
  vacancy_id: number;
  resume_id: number;
  status: 'not_started' | 'in_progress' | 'completed';
  scheduled_date?: string;
  start_date?: string;
  end_date?: string;
  duration_minutes?: number;
  dialogue?: any;
  summary?: string;
  pass_percentage?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Дополнительные поля для отображения
  candidate_name?: string;
  position?: string;
  interviewer?: string;
  vacancy?: any;
  resume?: any;
}

export interface InterviewCreate {
  vacancy_id: number;
  resume_id: number;
  scheduled_date: string;
  notes?: string;
}

export interface InterviewUpdate {
  status?: 'not_started' | 'in_progress' | 'completed';
  scheduled_date?: string;
  start_date?: string;
  end_date?: string;
  duration_minutes?: number;
  dialogue?: any;
  summary?: string;
  pass_percentage?: number;
  notes?: string;
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

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  birth_date?: string;
  location?: string;
  about?: string;
  desired_salary?: number;
  ready_to_relocate?: boolean;
  employment_type?: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    period: string;
  }>;
  skills?: string[];
  work_experience?: Array<{
    company: string;
    position: string;
    period: string;
    description: string;
  }>;
  preferred_position?: string;
  min_salary?: number;
  max_salary?: number;
  relocation?: string;
  employment_types?: string[];
  preferred_position_snake?: string;
  min_salary_snake?: number;
  max_salary_snake?: number;
  relocation_snake?: string;
  employment_types_snake?: string[];
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    // Нормализуем базовый URL: принудительно HTTPS и без завершающего слэша
    try {
      const parsed = new URL(baseURL);
      if (parsed.protocol === 'http:') {
        parsed.protocol = 'https:';
        console.warn('⚠️ API Client: Протокол http заменён на https для baseURL:', baseURL);
      }
      this.baseURL = parsed.origin;
    } catch {
      // Fallback для случаев, когда baseURL не является валидным URL
      this.baseURL = baseURL
        .replace(/^http:\/\//i, 'https://')
        .replace(/\/+$/g, '');
    }
    console.log('🌐 API Client: Base URL is', this.baseURL);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseURL}${path}`;
    
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

    // Удаляем логику добавления токена в заголовок Authorization, так как теперь используются куки
    // if (typeof window !== 'undefined') {
    //   const token = localStorage.getItem('access_token');
    //   if (token) {
    //     config.headers = {
    //       ...(config.headers as Record<string, string>),
    //       'Authorization': `Bearer ${token}`,
    //     };
    //   }
    // }
    
    console.log('🌐 API Client: Final config:', config);

    try {
      const response = await fetch(url, config);
      
      console.log('🌐 API Client: Response status:', response.status);
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      console.log('🌐 API Client: Response headers:', responseHeaders);
      
      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          const text = await response.text().catch(() => '');
          errorData = { detail: text || 'Unknown error' };
        }
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
    } catch (error) {
      console.error('❌ API Client: Fetch error', error);
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<TokenResponse> {
    console.log('🔐 API Client: Login credentials:', credentials);
    const result = await this.request<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    console.log('🔐 API Client: Login result:', result);
    return result;
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
    return this.request<any>('/analytics/candidate/stats');
  }

  async getCandidateInterviews(): Promise<any> {
    return this.request<any>('/analytics/candidate/recent-interviews');
  }

  async getHRStats(): Promise<any> {
    return this.request<any>('/analytics/hr/stats');
  }

  async getHRInterviews(): Promise<any> {
    return this.request<any>('/analytics/hr/interviews');
  }

  // Методы для интервью
  async getInterviews(): Promise<Interview[]> {
    return this.request<Interview[]>('/interviews');
  }

  async getInterview(id: number): Promise<Interview> {
    return this.request<Interview>(`/interviews/${id}`);
  }

  async createInterview(interview: InterviewCreate): Promise<Interview> {
    return this.request<Interview>('/interviews', {
      method: 'POST',
      body: JSON.stringify(interview),
    });
  }

  async updateInterview(id: number, interview: InterviewUpdate): Promise<Interview> {
    return this.request<Interview>(`/interviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(interview),
    });
  }

  async deleteInterview(id: number): Promise<void> {
    return this.request<void>(`/interviews/${id}`, {
      method: 'DELETE',
    });
  }

  async getInterviewsByVacancy(vacancyId: number): Promise<Interview[]> {
    return this.request<Interview[]>(`/interviews/vacancy/${vacancyId}`);
  }

  // Методы для вакансий
  async getVacancies(): Promise<any> {
    return this.request<any>('/vacancies/formatted');
  }

  async getVacancy(id: number): Promise<any> {
    return this.request<any>(`/vacancies/${id}`);
  }

  async applyToVacancy(vacancyId: number): Promise<any> {
    return this.request<any>(`/vacancies/${vacancyId}/apply`, {
      method: 'POST',
    });
  }

  async applyToVacancyWithFile(vacancyId: number, formData: FormData): Promise<any> {
    const url = `${this.baseURL}/applications/apply/${vacancyId}`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async createVacancy(vacancyData: any): Promise<any> {
    // Важно: бекенд ожидает завершающий слэш /vacancies/
    return this.request<any>('/vacancies/', {
      method: 'POST',
      body: JSON.stringify(vacancyData),
    });
  }

  async updateVacancy(vacancyId: number, vacancyData: any): Promise<any> {
    return this.request<any>(`/vacancies/${vacancyId}`, {
      method: 'PUT',
      body: JSON.stringify(vacancyData),
    });
  }

  async deleteVacancy(vacancyId: number): Promise<any> {
    return this.request<any>(`/vacancies/${vacancyId}`, {
      method: 'DELETE',
    });
  }

  // Методы для заявок
  async getApplications(): Promise<any> {
    return this.request<any>('/applications/my-applications');
  }

  async getApplication(id: number): Promise<any> {
    return this.request<any>(`/applications/${id}`);
  }

  // Вспомогательный метод: абсолютная ссылка на скачивание резюме
  getResumeDownloadUrl(resumePathOrApi: string): string {
    const path = resumePathOrApi.startsWith('/') ? resumePathOrApi : `/${resumePathOrApi}`
    return `${this.baseURL}${path}`
  }

  // Вспомогательный метод: абсолютная ссылка на скачивание резюме по resume_id
  getResumeDownloadUrlById(resumeId: number): string {
    return `${this.baseURL}/resumes/${resumeId}/download`
  }

  // Методы для кандидатов (HR)
  async getCandidates(params: { 
    processed?: boolean, 
    status?: string, 
    position?: string 
  } = {}): Promise<any> {
    const queryParams = new URLSearchParams()
    
    // Всегда фильтруем только обработанные резюме
    queryParams.append('processed', 'true')
    
    if (params.status) {
      queryParams.append('status_filter', params.status)
    }
    
    if (params.position) {
      queryParams.append('position', params.position)
    }
    
    const url = `/applications/all?${queryParams.toString()}`
    console.log('🔍 Fetching candidates with URL:', url)
    return this.request<any>(url)
  }

  async updateApplicationStatus(applicationId: number, status: string): Promise<any> {
    console.log('🔄 Updating application status:', { applicationId, status });
    const url = `/applications/${applicationId}/status?new_status=${status}`;
    console.log('📡 Request URL:', url);
    console.log('🔧 Method: PUT');
    return this.request<any>(url, { method: 'PUT' });
  }

  async deleteApplication(applicationId: number): Promise<any> {
    return this.request<any>(`/applications/${applicationId}`, { method: 'DELETE' });
  }

  async getCandidate(id: number): Promise<any> {
    return this.request<any>(`/candidates/${id}`);
  }

  async getResumeAnalysis(resumeId: number): Promise<any> {
    return this.request<any>(`/resumes/${resumeId}/analysis`)
  }

  // Методы для настроек пользователя
  async updateProfile(data: ProfileUpdateRequest): Promise<User> {
    return this.request<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: { oldPassword: string; newPassword: string }): Promise<any> {
    return this.request<any>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
