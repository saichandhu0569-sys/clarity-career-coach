export interface WorkExperience {
  role: string;
  company: string;
  duration: string;
  description: string[];
}

export interface Education {
  degree: string;
  institution: string;
  graduation_year: string;
}

export interface ResumeData {
  id?: number;
  file_name: string;
  uploaded_at?: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  summary: string | null;
  work_experience: WorkExperience[];
  education: Education[];
  technical_skills: string[];
  soft_skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies?: string[];
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date?: string;
  }>;
  resume_rating: number;
  improvement_areas: string;
  upskill_suggestions: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}