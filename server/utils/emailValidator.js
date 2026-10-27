/**
 * College Email Validation Utility for Symbiosis Institute of Technology (SIT), Nagpur
 * 
 * Requirements:
 * - Domain: @sitnagpur.siu.edu
 * - Student Pattern: firstname.lastname.batchYYYY@sitnagpur.siu.edu
 * - Batch year: 4-digit variable year (e.g., batch2021, batch2022, batch2023, batch2024, batch2025, etc.)
 */

export const COLLEGE_DOMAIN = 'sitnagpur.siu.edu';

/**
 * Normalizes an email address (trims and converts to lowercase).
 * @param {string} email 
 * @returns {string}
 */
export function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Validates whether an email follows the official SIT Nagpur student format:
 * firstname.lastname.batchYYYY@sitnagpur.siu.edu
 * 
 * @param {string} email 
 * @returns {{ isValid: boolean, error?: string, parsed?: { nameParts: string[], batchYear: string } }}
 */
export function validateCollegeEmail(email) {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    return {
      isValid: false,
      error: 'College email is required.'
    };
  }

  // Check domain
  if (!normalized.endsWith(`@${COLLEGE_DOMAIN}`)) {
    return {
      isValid: false,
      error: `Only official SIT Nagpur emails (@${COLLEGE_DOMAIN}) are permitted.`
    };
  }

  // Regex pattern: firstname.lastname(.optional).batchYYYY@sitnagpur.siu.edu
  // Matches: aswin.binu.batch2024@sitnagpur.siu.edu, tanmay.deshmukh.batch2023@sitnagpur.siu.edu
  const studentEmailRegex = /^[a-z0-9]+(\.[a-z0-9]+)+\.batch(\d{4})@sitnagpur\.siu\.edu$/;
  const match = normalized.match(studentEmailRegex);

  if (!match) {
    return {
      isValid: false,
      error: 'Email must follow the SIT Nagpur student format: firstname.lastname.batchYYYY@sitnagpur.siu.edu (e.g., aswin.binu.batch2024@sitnagpur.siu.edu)'
    };
  }

  const batchYear = match[2];
  const localPart = normalized.split('@')[0];
  const parts = localPart.split('.');
  const nameParts = parts.slice(0, -1); // excluding the batchYYYY part

  return {
    isValid: true,
    normalized,
    parsed: {
      nameParts,
      batchYear
    }
  };
}
