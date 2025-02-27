import { User } from '@/types/user';
import { Group } from '@/types/group';
import { useRuleValidation } from '@/hooks/useRuleValidation';

interface UserValidationProps {
  user: User;
  groups: Group[];
}

export function UserValidation({ user, groups }: UserValidationProps) {
  const { validateUser } = useRuleValidation();

  const validation = validateUser(user, groups);

  if (validation.isValid) {
    return null;
  }

  return (
    <div className='space-y-2'>
      {validation.violations.map(violation => (
        <div
          key={violation.ruleId}
          className='p-2 bg-red-50 text-red-700 rounded-md text-sm'
        >
          <strong>{violation.ruleName}:</strong> {violation.message}
        </div>
      ))}
    </div>
  );
}
