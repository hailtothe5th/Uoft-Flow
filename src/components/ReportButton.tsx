import React, { useState } from 'react';
import { Flag } from 'lucide-react';
import ReportModal from './ReportModal';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface ReportButtonProps {
  reviewId: string;
}

export default function ReportButton({ reviewId }: ReportButtonProps) {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated) {
      // Show a subtle prompt to sign in
      alert('Please sign in to report reviews');
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-error hover:bg-error/10 rounded-lg transition-all"
        aria-label="Report this review"
        title={isAuthenticated ? "Report this review" : "Sign in to report"}
      >
        <Flag className="w-3.5 h-3.5" />
        <span className="hidden sm:inline font-medium">Report</span>
      </button>

      {isAuthenticated && (
        <ReportModal
          reviewId={reviewId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
