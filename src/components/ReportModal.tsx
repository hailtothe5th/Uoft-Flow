import React, { useState } from 'react';
import { Report, ReportReason } from '../types';
import { X, Flag, AlertTriangle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface ReportModalProps {
  reviewId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportModal({ reviewId, isOpen, onClose }: ReportModalProps) {
  const { user } = useAuth();
  const { addReport } = useData();
  const [reason, setReason] = useState<ReportReason>('inappropriate');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    const report: Report = {
      id: uuidv4(),
      reviewId,
      reporterId: user.id,
      reporterName: user.displayName,
      reason,
      description,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await addReport(report);
    setIsSubmitting(false);
    setSubmitted(true);

    // Close after 2 seconds
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setReason('inappropriate');
      setDescription('');
    }, 2000);
  };

  const reasons: { value: ReportReason; label: string; icon: string }[] = [
    { value: 'spam', label: 'Spam or misleading', icon: '🚫' },
    { value: 'inappropriate', label: 'Inappropriate content', icon: '⚠️' },
    { value: 'false-info', label: 'False information', icon: '❌' },
    { value: 'harassment', label: 'Harassment or bullying', icon: '🚷' },
    { value: 'other', label: 'Other', icon: '📝' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full card-shadow border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Report Review</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Report Submitted
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Thank you for helping keep our community safe. We'll review this report shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Why are you reporting this review?
                </label>
                <div className="space-y-2">
                  {reasons.map((r) => (
                    <label
                      key={r.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        reason === r.value
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={r.value}
                        checked={reason === r.value}
                        onChange={(e) => setReason(e.target.value as ReportReason)}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-lg">{r.icon}</span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {r.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Additional details (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide more context about the issue..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 resize-none"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
                  {description.length}/500
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Flag className="w-4 h-4" />
                      Submit Report
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
