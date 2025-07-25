import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResumeData } from '@/types/resume';

interface ResumeUploaderProps {
  onAnalysisComplete: (data: ResumeData) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  onAnalysisComplete,
  isAnalyzing,
  setIsAnalyzing
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState(0);

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

  const analyzeResume = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    setProgress(0);
    setError('');

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append('resume', uploadedFile);

      // Here you would make the actual API call to your Node.js backend
      // const response = await fetch('/api/resumes/upload', {
      //   method: 'POST',
      //   body: formData
      // });

      // For demo purposes, I'll simulate the API response
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock response data
      const mockResponse: ResumeData = {
        id: Date.now(),
        file_name: uploadedFile.name,
        uploaded_at: new Date().toISOString(),
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+1 (555) 123-4567",
        linkedin_url: "https://linkedin.com/in/johndoe",
        portfolio_url: "https://johndoe.dev",
        summary: "Experienced full-stack developer with 5+ years in React and Node.js",
        work_experience: [
          {
            role: "Senior Full Stack Developer",
            company: "Tech Corp",
            duration: "2022 - Present",
            description: [
              "Led development of React-based web applications",
              "Implemented REST APIs using Node.js and Express",
              "Managed PostgreSQL databases and optimized queries"
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
        technical_skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
        soft_skills: ["Leadership", "Communication", "Problem Solving", "Team Collaboration"],
        projects: [
          {
            name: "E-commerce Platform",
            description: "Built a full-stack e-commerce solution",
            technologies: ["React", "Node.js", "MongoDB"]
          }
        ],
        certifications: [
          {
            name: "AWS Certified Developer",
            issuer: "Amazon Web Services",
            date: "2023"
          }
        ],
        resume_rating: 8,
        improvement_areas: "Consider adding more quantifiable achievements and metrics to demonstrate impact. Include more recent technologies like Next.js or cloud platforms.",
        upskill_suggestions: ["Next.js", "Docker", "Kubernetes", "GraphQL", "React Native"]
      };

      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        onAnalysisComplete(mockResponse);
        setIsAnalyzing(false);
        setProgress(0);
      }, 500);

    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
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
                <span className="text-sm font-medium">Analyzing resume...</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
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
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Analyze Resume
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};