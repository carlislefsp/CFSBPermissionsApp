import { BusinessRule, RuleContext, ValidationResult } from '@/types/rules';
import { createGroupValidator } from '@/lib/group-utils';

export const customerRequirementRule: BusinessRule = {
  id: 'CUSTOMER_REQUIREMENT_RULE',
  name: 'Customer Group Requirement Rule',
  description:
    'Sales Reps and Distributors must have at least one customer group',

  validate: ({ user, groups }: RuleContext): ValidationResult => {
    const validator = createGroupValidator(groups);
    const isSalesRepOrDistributor =
      validator.isSalesRep() || validator.isDistributor();

    if (isSalesRepOrDistributor && !validator.hasCustomers()) {
      return {
        isValid: false,
        message:
          'Users in ECommerce-Sales Rep or ECommerce-Distributor must also be in a customer group',
      };
    }

    return { isValid: true, message: null };
  },
};
