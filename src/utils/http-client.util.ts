import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiResponse<T = any> {
  message: string;
  code: string;
  data?: T;
}

interface ServerResponse<T> {
  message: string;
  code: string;
  data: T;
}

class SwsyaClient {
  private api: AxiosInstance;
  private authToken: string | null = null;
  private config: AxiosRequestConfig = {
    headers: {
      from: 'web',
    },
  };

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  setAuthToken(token: string): this {
    this.authToken = token;
    return this;
  }

  private async performRequest<T>(
    config: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      if (this.authToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${this.authToken}`,
        };
      }

      const response: AxiosResponse<ServerResponse<T>> =
        await this.api.request(config);
      return {
        message: response.data.message,
        code: response.data.code,
        data: response.data.data || ('Empty' as any),
      };
    } catch (error: any) {
      return {
        message:
          error.response.data.message ||
          'Something went wrong. Plese try again.',
        code: error.response.data.code || 'Empty',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    this.config.method = 'GET';
    this.config.url = endpoint;

    return this.performRequest<T>(this.config);
  }

  async post<T, D>(endpoint: string, data?: D): Promise<ApiResponse<T>> {
    this.config.method = 'POST';
    this.config.url = endpoint;
    this.config.data = data;

    return this.performRequest<T>(this.config);
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    this.config.method = 'PATCH';
    this.config.url = endpoint;
    this.config.data = data;

    return this.performRequest<T>(this.config);
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    this.config.method = 'PUT';
    this.config.url = endpoint;
    this.config.data = data;

    return this.performRequest<T>(this.config);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    this.config.method = 'DELETE';
    this.config.url = endpoint;

    return this.performRequest<T>(this.config);
  }
}

const swsyaClient = new SwsyaClient('https://swertesaya-api.vercel.app');
export default swsyaClient;
