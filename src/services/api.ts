import { ResumeData, ApiResponse } from '@/types/resume';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api' 
  : 'http://localhost:3001/api';

export class ApiService {
  private static async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP error! status: ${response.status}`
        };
      }
      
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static async uploadResume(file: File): Promise<ApiResponse<ResumeData>> {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(`${API_BASE_URL}/resumes/upload`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
      });

      return this.handleResponse<ResumeData>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  static async getAllResumes(): Promise<ApiResponse<ResumeData[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/resumes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<ResumeData[]>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  static async getResumeById(id: number): Promise<ApiResponse<ResumeData>> {
    try {
      const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<ResumeData>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  // Health check to test backend connectivity
  static async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
      });

      return this.handleResponse<{ status: string; timestamp: string }>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Backend connection failed'
      };
    }
  }
}