import { BusinessRule, RuleContext, ValidationResult } from '@/types/rules';
import { createGroupValidator } from '@/lib/group-utils';

export const regularUserRoleRule: BusinessRule = {
  id: 'REGULAR_USER_ROLE_RULE',
  name: 'Regular User Role Assignment Rule',
  description:
    'ECommerce-Regular users with customers must have exactly one role: Sales Rep or Distributor',

  validate: ({ user, groups }: RuleContext): ValidationResult => {
    const validator = createGroupValidator(groups);

    // Only apply rule to Regular users
    if (!validator.isRegular()) {
      return { isValid: true, message: null };
    }

    // Only apply rule if they have customer groups
    if (!validator.hasCustomers()) {
      return { isValid: true, message: null };
    }

    const isSalesRep = validator.isSalesRep();
    const isDistributor = validator.isDistributor();

    if (isSalesRep && isDistributor) {
      return {
        isValid: false,
        message:
          'Users in ECommerce-Regular with customers cannot be in both Sales Rep and Distributor groups',
      };
    }

    if (!isSalesRep && !isDistributor) {
      return {
        isValid: false,
        message:
          'Users in ECommerce-Regular with customers must be in either Sales Rep or Distributor group',
      };
    }

    return { isValid: true, message: null };
  },
};
