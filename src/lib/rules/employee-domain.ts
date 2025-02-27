import { BusinessRule, RuleContext, ValidationResult } from '@/types/rules';
import { GROUP_IDS } from '@/config/groups';
import { EMPLOYEE_DOMAINS } from '@/config/domains';
import { groupUtils, createGroupValidator } from '@/lib/group-utils';

export const employeeDomainRule: BusinessRule = {
  id: 'EMPLOYEE_DOMAIN_RULE',
  name: 'Employee Domain Group Rule',
  description:
    'Users with employee domains must be in Employee group and vice versa',

  validate: ({ user, groups }: RuleContext): ValidationResult => {
    const validator = createGroupValidator(groups);
    const hasEmployeeDomain = groupUtils.isEmployeeDomain(user.email);
    const isInEmployeeGroup = validator.isEmployee();

    // Check both conditions
    if (hasEmployeeDomain && !isInEmployeeGroup) {
      return {
        isValid: false,
        message: `Users with ${EMPLOYEE_DOMAINS.join(
          ', ',
        )} email must be in the Employee group`,
      };
    }

    if (!hasEmployeeDomain && isInEmployeeGroup) {
      return {
        isValid: false,
        message: `Users in Employee group must have an email from: ${EMPLOYEE_DOMAINS.join(
          ', ',
        )}`,
      };
    }

    return { isValid: true, message: null };
  },
};
