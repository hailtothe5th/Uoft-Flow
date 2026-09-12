import React, { useState } from 'react';
import { Flag } from 'lucide-react';
import ReportModal from './ReportModal';
import { useAuth } from '../context/AuthContext';

interface ReportButtonProps {
  reviewId: string;
}

export default function ReportButton({ reviewId }: ReportButtonProps) {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        aria-label="Report this review"
        title="Report this review"
      >
        <Flag className="w-3 h-3" />
        <span className="hidden sm:inline">Report</span>
      </button>

      <ReportModal
        reviewId={reviewId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
