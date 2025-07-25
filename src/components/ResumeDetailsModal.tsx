import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ResumeDetails } from './ResumeDetails';
import { ResumeData } from '@/types/resume';

interface ResumeDetailsModalProps {
  resume: ResumeData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeDetailsModal: React.FC<ResumeDetailsModalProps> = ({
  resume,
  isOpen,
  onClose
}) => {
  if (!resume) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Resume Analysis Details - {resume.name || 'Unknown'}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ResumeDetails resume={resume} />
        </div>
      </DialogContent>
    </Dialog>
  );
};