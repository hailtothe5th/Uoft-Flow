import { Review } from '../types';

// Automated content filtering system
// This provides basic filtering for inappropriate content

// List of patterns to filter (can be expanded)
const INAPPROPRIATE_PATTERNS = [
  // Profanity and offensive language
  /\b(fuck|shit|damn|hell|ass|bitch|bastard)\b/i,
  
  // Harassment and bullying
  /\b(stupid|idiot|dumb|loser|hate you)\b/i,
  
  // Discriminatory language
  /\b(retard|fag|nigger|kike)\b/i,
  
  // Spam indicators
  /(click here|buy now|free money|earn cash|make money fast)/i,
  /https?:\/\/[^\s]+/i, // URLs
  
  // Excessive caps (shouting)
  /[A-Z]{10,}/,
  
  // Excessive special characters
  /[!@#$%^&*()]{5,}/,
];

// Severity levels for different types of violations
const SEVERITY_LEVELS = {
  profanity: 1,
  harassment: 2,
  discriminatory: 3,
  spam: 1,
  excessiveCaps: 0.5,
  excessiveSymbols: 0.5,
};

export interface FilterResult {
  isFlagged: boolean;
  reasons: string[];
  severity: number;
}

/**
 * Analyzes a review for inappropriate content
 */
export function analyzeReview(review: Review): FilterResult {
  const textToCheck = `${review.comment} ${review.userName}`.toLowerCase();
  const reasons: string[] = [];
  let totalSeverity = 0;

  // Check each pattern
  for (const pattern of INAPPROPRIATE_PATTERNS) {
    if (pattern.test(textToCheck)) {
      const match = textToCheck.match(pattern);
      if (match) {
        const matchedText = match[0].toLowerCase();
        
        // Categorize the violation
        if (/\b(fuck|shit|damn|hell|ass|bitch|bastard)\b/i.test(matchedText)) {
          reasons.push('Profanity detected');
          totalSeverity += SEVERITY_LEVELS.profanity;
        } else if (/\b(stupid|idiot|dumb|loser|hate you)\b/i.test(matchedText)) {
          reasons.push('Harassment detected');
          totalSeverity += SEVERITY_LEVELS.harassment;
        } else if (/\b(retard|fag|nigger|kike)\b/i.test(matchedText)) {
          reasons.push('Discriminatory language detected');
          totalSeverity += SEVERITY_LEVELS.discriminatory;
        } else if (/(click here|buy now|free money|earn cash|make money fast)/i.test(matchedText)) {
          reasons.push('Spam detected');
          totalSeverity += SEVERITY_LEVELS.spam;
        } else if (/https?:\/\//i.test(matchedText)) {
          reasons.push('URL detected (potential spam)');
          totalSeverity += SEVERITY_LEVELS.spam;
        } else if (/[A-Z]{10,}/.test(matchedText)) {
          reasons.push('Excessive capitalization');
          totalSeverity += SEVERITY_LEVELS.excessiveCaps;
        } else if (/[!@#$%^&*()]{5,}/.test(matchedText)) {
          reasons.push('Excessive special characters');
          totalSeverity += SEVERITY_LEVELS.excessiveSymbols;
        }
      }
    }
  }

  // Check for very short/low-effort comments (not necessarily bad, but worth noting)
  if (review.comment.length > 0 && review.comment.length < 3) {
    reasons.push('Very short comment');
    totalSeverity += 0.1;
  }

  return {
    isFlagged: reasons.length > 0,
    reasons,
    severity: totalSeverity,
  };
}

/**
 * Determines if a review should be automatically hidden based on severity
 */
export function shouldAutoHide(review: Review): boolean {
  const result = analyzeReview(review);
  // Auto-hide if severity is high (discriminatory language or multiple violations)
  return result.severity >= 3;
}

/**
 * Gets a warning message for a flagged review
 */
export function getWarningMessage(review: Review): string | null {
  const result = analyzeReview(review);
  if (!result.isFlagged) return null;
  
  if (result.severity >= 3) {
    return 'This review has been hidden due to community guidelines violations.';
  } else if (result.severity >= 2) {
    return 'This review contains content that may violate community guidelines.';
  } else {
    return 'This review has been flagged for review.';
  }
}

/**
 * Filters an array of reviews, removing or flagging inappropriate ones
 */
export function filterReviews(reviews: Review[]): { visible: Review[]; flagged: Review[] } {
  const visible: Review[] = [];
  const flagged: Review[] = [];

  for (const review of reviews) {
    if (shouldAutoHide(review)) {
      flagged.push(review);
    } else {
      visible.push(review);
    }
  }

  return { visible, flagged };
}
