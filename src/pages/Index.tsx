import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResumeUploader } from '@/components/ResumeUploader';
import { ResumeDetails } from '@/components/ResumeDetails';
import { PastResumesTable } from '@/components/PastResumesTable';
import { ResumeDetailsModal } from '@/components/ResumeDetailsModal';
import { ResumeData } from '@/types/resume';
import { FileText, History, Brain, Sparkles } from 'lucide-react';

const Index = () => {
  const [analyzedResume, setAnalyzedResume] = useState<ResumeData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pastResumes, setPastResumes] = useState<ResumeData[]>([]);
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAnalysisComplete = (data: ResumeData) => {
    setAnalyzedResume(data);
    setPastResumes(prev => [data, ...prev]);
  };

  const handleViewDetails = (resume: ResumeData) => {
    setSelectedResume(resume);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedResume(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center mr-4">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Resume Analyzer
            </h1>
            <Sparkles className="h-6 w-6 text-primary-glow ml-2" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your resume to get AI-powered insights, detailed analysis, and personalized improvement suggestions
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="analyze" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
            <TabsTrigger value="analyze" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Live Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <History className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            <ResumeUploader
              onAnalysisComplete={handleAnalysisComplete}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
            />

            {analyzedResume && !isAnalyzing && (
              <Card className="shadow-elegant border-2 border-primary/20">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-t-lg">
                  <CardTitle className="text-xl font-bold flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-primary" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResumeDetails resume={analyzedResume} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <PastResumesTable
              resumes={pastResumes}
              onViewDetails={handleViewDetails}
            />
          </TabsContent>
        </Tabs>

        {/* Modal for detailed view */}
        <ResumeDetailsModal
          resume={selectedResume}
          isOpen={isModalOpen}
          onClose={closeModal}
        />

        {/* Backend Integration Notice */}
        <Card className="mt-8 border-warning/20 bg-warning/5">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="h-6 w-6 rounded-full bg-warning/20 flex items-center justify-center mt-0.5">
                <FileText className="h-4 w-4 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-warning mb-2">Backend Integration Required</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  This frontend is ready to connect to your Node.js backend. The current demo shows mock data. 
                  To enable real PDF analysis with Google Gemini LLM:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>API Endpoint:</strong> <code className="bg-muted px-2 py-1 rounded text-xs">POST /api/resumes/upload</code></p>
                  <p><strong>Google API Key:</strong> {process.env.NODE_ENV === 'development' ? 'AIzaSyCMfxt1QEWTn925MzvjeP_lj2yhGyRFEdM' : '[HIDDEN]'}</p>
                  <p><strong>Expected Response:</strong> JSON object matching the ResumeData interface</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;