import { useMemo } from 'react';
import { createRuleEngine } from '@/lib/rule-engine';

export function useRuleValidation() {
  // Create a memoized instance of the rule engine
  const ruleEngine = useMemo(() => createRuleEngine(), []);

  return {
    validateUser: ruleEngine.validateUser,
    validateUsers: ruleEngine.validateUsers,
    clearCache: ruleEngine.clearCache,
  };
}
