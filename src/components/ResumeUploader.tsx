import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResumeData } from '@/types/resume';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface ResumeUploaderProps {
  onAnalysisComplete: (data: ResumeData) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  onBackendStatusChange?: (isConnected: boolean) => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  onAnalysisComplete,
  isAnalyzing,
  setIsAnalyzing,
  onBackendStatusChange
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setError('');
    } else {
      setError('Please upload a valid PDF file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  // Check backend connectivity on component mount
  React.useEffect(() => {
    const checkBackend = async () => {
      const result = await ApiService.healthCheck();
      const connected = result.success;
      setBackendConnected(connected);
      onBackendStatusChange?.(connected);
      
      if (!connected) {
        setUseMockData(true);
        toast({
          title: "Backend Disconnected",
          description: "Using mock data for demonstration. Connect your Node.js backend to enable real analysis.",
          variant: "default",
        });
      }
    };
    
    checkBackend();
  }, [onBackendStatusChange, toast]);

  const getMockResponse = (): ResumeData => ({
    id: Date.now(),
    file_name: uploadedFile?.name || 'sample-resume.pdf',
    uploaded_at: new Date().toISOString(),
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    linkedin_url: "https://linkedin.com/in/johndoe",
    portfolio_url: "https://johndoe.dev",
    summary: "Experienced full-stack developer with 5+ years in React and Node.js, passionate about creating scalable web applications and mentoring junior developers.",
    work_experience: [
      {
        role: "Senior Full Stack Developer",
        company: "Tech Corp",
        duration: "2022 - Present",
        description: [
          "Led development of React-based web applications serving 100K+ users",
          "Implemented REST APIs using Node.js and Express with 99.9% uptime",
          "Managed PostgreSQL databases and optimized queries reducing load time by 40%",
          "Mentored 3 junior developers and conducted code reviews"
        ]
      },
      {
        role: "Full Stack Developer",
        company: "StartupXYZ",
        duration: "2020 - 2022",
        description: [
          "Built e-commerce platform from scratch using MERN stack",
          "Integrated payment gateways and third-party APIs",
          "Implemented responsive design and improved mobile performance"
        ]
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "University of Technology",
        graduation_year: "2019"
      }
    ],
    technical_skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker", "Git", "Python"],
    soft_skills: ["Leadership", "Communication", "Problem Solving", "Team Collaboration", "Mentoring"],
    projects: [
      {
        name: "E-commerce Platform",
        description: "Built a full-stack e-commerce solution with user authentication, payment processing, and admin dashboard",
        technologies: ["React", "Node.js", "MongoDB", "Stripe API"]
      },
      {
        name: "Task Management App",
        description: "Developed a collaborative task management application with real-time updates",
        technologies: ["React", "Socket.io", "Express", "PostgreSQL"]
      }
    ],
    certifications: [
      {
        name: "AWS Certified Developer - Associate",
        issuer: "Amazon Web Services",
        date: "2023"
      },
      {
        name: "MongoDB Certified Developer",
        issuer: "MongoDB Inc.",
        date: "2022"
      }
    ],
    resume_rating: 8,
    improvement_areas: "Consider adding more quantifiable achievements and metrics to demonstrate impact. Include more recent technologies like Next.js or cloud platforms. Add specific numbers for projects and team size managed.",
    upskill_suggestions: ["Next.js", "Kubernetes", "GraphQL", "React Native", "Machine Learning", "DevOps"]
  });

  const analyzeResume = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    setProgress(0);
    setError('');

    try {
      // Progress simulation for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 85) {
            clearInterval(progressInterval);
            return 85;
          }
          return prev + 15;
        });
      }, 300);

      let result;
      
      if (backendConnected && !useMockData) {
        // Real API call to backend
        result = await ApiService.uploadResume(uploadedFile);
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to analyze resume');
        }
      } else {
        // Mock data for demonstration
        await new Promise(resolve => setTimeout(resolve, 2000));
        result = {
          success: true,
          data: getMockResponse()
        };
      }

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success && result.data) {
        toast({
          title: "Analysis Complete!",
          description: `Resume analyzed successfully. Rating: ${result.data.resume_rating}/10`,
        });

        setTimeout(() => {
          onAnalysisComplete(result.data!);
          setIsAnalyzing(false);
          setProgress(0);
        }, 500);
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze resume. Please try again.';
      setError(errorMessage);
      setIsAnalyzing(false);
      setProgress(0);
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Backend Status Indicator */}
      <Card className="shadow-card border-2 border-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {backendConnected === null ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
              ) : backendConnected ? (
                <Wifi className="h-4 w-4 text-success" />
              ) : (
                <WifiOff className="h-4 w-4 text-warning" />
              )}
              <span className="text-sm font-medium">
                Backend Status: {backendConnected === null ? 'Checking...' : backendConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            {!backendConnected && backendConnected !== null && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUseMockData(!useMockData)}
                className="text-xs"
              >
                {useMockData ? 'Using Mock Data' : 'Try Real API'}
              </Button>
            )}
          </div>
          {!backendConnected && backendConnected !== null && (
            <p className="text-xs text-muted-foreground mt-2">
              {useMockData 
                ? 'Demo mode active. Start your Node.js backend to enable real PDF analysis.' 
                : 'Attempting to connect to backend at http://localhost:3001/api'
              }
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card transition-all duration-300 hover:shadow-elegant">
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300",
              isDragActive 
                ? "border-primary bg-accent/50" 
                : "border-muted-foreground/25 hover:border-primary/50",
              uploadedFile && "border-success bg-success/5"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              {uploadedFile ? (
                <>
                  <CheckCircle className="h-12 w-12 text-success" />
                  <div>
                    <p className="text-lg font-medium text-success">File Ready</p>
                    <p className="text-sm text-muted-foreground">{uploadedFile.name}</p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium">
                      {isDragActive ? "Drop your resume here" : "Upload your resume"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Drag & drop a PDF file or click to browse
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {isAnalyzing && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {backendConnected && !useMockData 
                    ? 'Processing with AI...' 
                    : 'Analyzing resume (Demo)...'
                  }
                </span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {backendConnected && !useMockData 
                  ? 'Extracting text from PDF and analyzing with Google Gemini LLM'
                  : 'Demo mode - showing sample analysis results'
                }
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <Button
              onClick={analyzeResume}
              disabled={!uploadedFile || isAnalyzing}
              className="px-8 py-2 bg-gradient-to-r from-primary to-primary-glow hover:shadow-elegant transition-all duration-300"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {backendConnected && !useMockData ? 'Processing...' : 'Analyzing...'}
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  {backendConnected && !useMockData ? 'Analyze with AI' : 'Analyze Resume (Demo)'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};