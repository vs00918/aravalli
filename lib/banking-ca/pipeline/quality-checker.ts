import { ExtractedEvent } from './types';

export interface QualityCheckResult {
  passed: boolean;
  issues: string[];
}

export class QualityChecker {
  public static check(event: ExtractedEvent): QualityCheckResult {
    const issues: string[] = [];

    if (!event.title || event.title.trim().length < 5) {
      issues.push('Title is too short or empty');
    }

    if (!event.category) {
      issues.push('Missing category');
    }

    if (!event.priority) {
      issues.push('Missing priority');
    }

    if (!event.eventDate || !/^\d{4}-\d{2}-\d{2}$/.test(event.eventDate)) {
      issues.push(`Invalid event date format: '${event.eventDate}' (expected YYYY-MM-DD)`);
    }

    if (!event.mustMemorizeFacts || event.mustMemorizeFacts.length === 0) {
      issues.push('Must memorize facts list cannot be empty');
    }

    const totalFactLength = (event.mustMemorizeFacts || []).join(' ').length +
                            (event.knowUnderstandContext || []).join(' ').length +
                            (event.examFocus || []).join(' ').length;

    if (totalFactLength < 25) {
      issues.push('Total substantive fact content is insufficient (<25 chars)');
    }

    return {
      passed: issues.length === 0,
      issues
    };
  }
}
