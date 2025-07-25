import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Calendar, Star, FileText } from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { cn } from '@/lib/utils';

interface PastResumesTableProps {
  resumes: ResumeData[];
  onViewDetails: (resume: ResumeData) => void;
}

export const PastResumesTable: React.FC<PastResumesTableProps> = ({
  resumes,
  onViewDetails
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-success';
    if (rating >= 6) return 'text-warning';
    return 'text-destructive';
  };

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 8) return 'bg-success/10 text-success hover:bg-success/20';
    if (rating >= 6) return 'bg-warning/10 text-warning hover:bg-warning/20';
    return 'bg-destructive/10 text-destructive hover:bg-destructive/20';
  };

  if (resumes.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No resumes analyzed yet</h3>
          <p className="text-muted-foreground text-center">
            Upload and analyze your first resume to see it appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Resume Analysis History ({resumes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">File Name</TableHead>
                <TableHead className="font-semibold">Upload Date</TableHead>
                <TableHead className="font-semibold text-center">Rating</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resumes.map((resume) => (
                <TableRow 
                  key={resume.id} 
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <span className="text-xs font-semibold text-primary">
                          {resume.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                      {resume.name || 'Name not found'}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {resume.email || 'Not provided'}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {resume.file_name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {resume.uploaded_at ? formatDate(resume.uploaded_at) : 'Unknown'}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant="secondary" 
                      className={cn("font-semibold", getRatingBadgeColor(resume.resume_rating))}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      {resume.resume_rating}/10
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(resume)}
                      className="hover:bg-primary/10 hover:text-primary border-primary/20"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};