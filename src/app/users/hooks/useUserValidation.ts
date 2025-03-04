import { User } from '@/types/user';
import { Group } from '@/types/group';
import { useRuleValidation } from '@/hooks/useRuleValidation';
import { useMemo } from 'react';

export function useUserValidation(
  users: User[],
  groupsByUser: Map<string, Group[]>,
) {
  const { validateUsers } = useRuleValidation();

  const violations = useMemo(() => {
    return validateUsers(users, groupsByUser);
  }, [users, groupsByUser, validateUsers]);

  return violations;
}
