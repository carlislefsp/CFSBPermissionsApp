import { BusinessRule, RuleContext, ValidationResult } from '@/types/rules';
import { createGroupValidator } from '@/lib/group-utils';

export const customerRoleRule: BusinessRule = {
  id: 'CUSTOMER_ROLE_RULE',
  name: 'Customer Role Requirement Rule',
  description:
    'Users with customer groups must be either Sales Rep or Distributor',

  validate: ({ user, groups }: RuleContext): ValidationResult => {
    const validator = createGroupValidator(groups);

    if (
      validator.hasCustomers() &&
      !(validator.isSalesRep() || validator.isDistributor())
    ) {
      return {
        isValid: false,
        message:
          'Users in a customer group must also be in ECommerce-Sales Rep or ECommerce-Distributor group',
      };
    }

    return { isValid: true, message: null };
  },
};
