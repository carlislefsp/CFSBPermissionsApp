import { User } from '@/types/user';
import { Group } from '@/types/group';
import { BusinessRule, ValidationResult, RuleContext } from '@/types/rules';
import { businessRules } from './rules';

interface RuleViolation {
  ruleId: string;
  ruleName: string;
  message: string;
}

interface ValidationResponse {
  isValid: boolean;
  violations: RuleViolation[];
}

type CacheEntry = {
  response: ValidationResponse;
  timestamp: number;
};

export const createRuleEngine = () => {
  const cache = new Map<string, CacheEntry>();
  const cacheTimeout = 5 * 60 * 1000; // 5 minutes

  const getCacheKey = (user: User, groups: Group[]): string => {
    return `${user.oid}-${user.email}-${groups.map(g => g.id).join(',')}`;
  };

  const validateUser = (
    user: User,
    groups: Group[],
    rules: BusinessRule[] = businessRules,
  ): ValidationResponse => {
    const cacheKey = getCacheKey(user, groups);
    const now = Date.now();

    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && now - cached.timestamp < cacheTimeout) {
      return cached.response;
    }

    const context: RuleContext = { user, groups };
    const violations: RuleViolation[] = [];

    // Run all rules
    for (const rule of rules) {
      const result = rule.validate(context);
      if (!result.isValid && result.message) {
        violations.push({
          ruleId: rule.id,
          ruleName: rule.name,
          message: result.message,
        });
      }
    }

    const response: ValidationResponse = {
      isValid: violations.length === 0,
      violations,
    };

    // Update cache
    cache.set(cacheKey, { response, timestamp: now });

    return response;
  };

  const validateUsers = (
    users: User[],
    groupsByUser: Map<string, Group[]>,
  ): Map<string, ValidationResponse> => {
    const results = new Map<string, ValidationResponse>();

    for (const user of users) {
      const userGroups = groupsByUser.get(user.oid) || [];
      const validation = validateUser(user, userGroups);
      if (!validation.isValid) {
        results.set(user.oid, validation);
      }
    }

    return results;
  };

  const clearCache = () => cache.clear();

  return {
    validateUser,
    validateUsers,
    clearCache,
  };
};
