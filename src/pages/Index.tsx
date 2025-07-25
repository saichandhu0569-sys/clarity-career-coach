import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResumeUploader } from '@/components/ResumeUploader';
import { ResumeDetails } from '@/components/ResumeDetails';
import { PastResumesTable } from '@/components/PastResumesTable';
import { ResumeDetailsModal } from '@/components/ResumeDetailsModal';
import { ResumeData } from '@/types/resume';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { FileText, History, Brain, Sparkles, Server, Wifi, WifiOff } from 'lucide-react';

const Index = () => {
  const [analyzedResume, setAnalyzedResume] = useState<ResumeData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pastResumes, setPastResumes] = useState<ResumeData[]>([]);
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const { toast } = useToast();

  // Load historical resumes from backend
  const loadPastResumes = async () => {
    if (!backendConnected) return;
    
    setLoadingHistory(true);
    try {
      const result = await ApiService.getAllResumes();
      if (result.success && result.data) {
        setPastResumes(result.data);
      } else {
        toast({
          title: "Failed to load history",
          description: result.error || "Could not fetch past resumes",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading past resumes:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Load past resumes when backend connects
  useEffect(() => {
    if (backendConnected) {
      loadPastResumes();
    }
  }, [backendConnected]);

  const handleBackendStatusChange = (connected: boolean) => {
    setBackendConnected(connected);
    if (connected) {
      toast({
        title: "Backend Connected!",
        description: "Real PDF analysis with Google Gemini is now available.",
      });
    }
  };

  const handleAnalysisComplete = (data: ResumeData) => {
    setAnalyzedResume(data);
    // Add to local state immediately for better UX
    setPastResumes(prev => [data, ...prev]);
    
    // If backend is connected, refresh the list to get updated data from server
    if (backendConnected) {
      loadPastResumes();
    }
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

        {/* Backend Status Banner */}
        <Card className={cn(
          "mb-6 border-2 transition-all duration-300",
          backendConnected 
            ? "border-success/20 bg-success/5" 
            : "border-warning/20 bg-warning/5"
        )}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {backendConnected ? (
                  <Wifi className="h-5 w-5 text-success" />
                ) : (
                  <WifiOff className="h-5 w-5 text-warning" />
                )}
                <div>
                  <h3 className="font-semibold">
                    {backendConnected ? 'Backend Connected' : 'Backend Required'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {backendConnected 
                      ? 'Real PDF analysis with Google Gemini LLM is active'
                      : 'Start your Node.js backend to enable full functionality'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-mono text-muted-foreground">
                  {backendConnected ? 'localhost:3001' : 'Disconnected'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="analyze" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
            <TabsTrigger value="analyze" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Live Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <History className="h-4 w-4" />
              <span>History ({pastResumes.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            <ResumeUploader
              onAnalysisComplete={handleAnalysisComplete}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
              onBackendStatusChange={handleBackendStatusChange}
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
            {loadingHistory ? (
              <Card className="shadow-card">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                    <span className="text-muted-foreground">Loading resume history...</span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <PastResumesTable
                resumes={pastResumes}
                onViewDetails={handleViewDetails}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Modal for detailed view */}
        <ResumeDetailsModal
          resume={selectedResume}
          isOpen={isModalOpen}
          onClose={closeModal}
        />

        {/* Backend Setup Instructions */}
        {!backendConnected && (
          <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <Server className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">Start Your Node.js Backend</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    The frontend is ready! Start your backend server to enable real PDF analysis:
                  </p>
                  <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
                    <p><strong>Required Endpoints:</strong></p>
                    <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                      <li><code>GET /api/health</code> - Health check</li>
                      <li><code>POST /api/resumes/upload</code> - Upload & analyze PDF</li>
                      <li><code>GET /api/resumes</code> - Get all resumes</li>
                      <li><code>GET /api/resumes/:id</code> - Get specific resume</li>
                    </ul>
                    <p className="mt-3"><strong>Google API Key:</strong> <code className="text-xs">AIzaSyCMfxt1QEWTn925MzvjeP_lj2yhGyRFEdM</code></p>
                    <p><strong>Expected Backend URL:</strong> <code className="text-xs">http://localhost:3001</code></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;