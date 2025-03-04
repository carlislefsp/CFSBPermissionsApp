import { BusinessRule, RuleContext, ValidationResult } from '@/types/rules';
import { GROUP_IDS } from '@/config/groups';
import { groupUtils, createGroupValidator } from '@/lib/group-utils';

export const salesRepTypeRule: BusinessRule = {
  id: 'SALES_REP_TYPE_RULE',
  name: 'Sales Rep Type Assignment Rule',
  description:
    'Sales Reps must have at least one specific sales rep type (CFP, DNX, or SMP)',

  validate: ({ user, groups }: RuleContext): ValidationResult => {
    const validator = createGroupValidator(groups);

    // Only apply to Sales Reps
    if (!validator.isSalesRep()) {
      return { isValid: true, message: null };
    }

    // Check if they have any of the sales rep type groups
    if (!validator.hasSalesRepType()) {
      return {
        isValid: false,
        message:
          'Users in ECommerce-Sales Rep must be in at least one of: ' +
          'ECommerce-CFP Sales Rep, ECommerce-DNX Sales Rep, or ECommerce-SMP Sales Rep groups',
      };
    }

    return { isValid: true, message: null };
  },
};
