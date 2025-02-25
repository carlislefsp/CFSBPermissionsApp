/**
 * Configuration for employee email domains
 * Used to distinguish employees from external users
 */
export const EMPLOYEE_DOMAINS = [
  'cfsbrands.com',
  'getserveware.com',
  'wincous.com',
  // Add other employee domains as needed
];

/**
 * Check if an email belongs to an employee domain
 */
export function isEmployeeEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? EMPLOYEE_DOMAINS.includes(domain) : false;
}
