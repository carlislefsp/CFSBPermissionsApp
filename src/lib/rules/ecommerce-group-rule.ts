import { BusinessRule, RuleContext, ValidationResult } from '@/types/rules';
import { createGroupValidator } from '@/lib/group-utils';

export const ecommerceGroupRule: BusinessRule = {
  id: 'ECOMMERCE_GROUP_RULE',
  name: 'ECommerce Group Membership Rule',
  description:
    'Users must be in exactly one of: ECommerce-Regular or ECommerce-Employee',

  validate: ({ groups }: RuleContext): ValidationResult => {
    const validator = createGroupValidator(groups);
    const isRegular = validator.isRegular();
    const isEmployee = validator.isEmployee();

    if (isRegular && isEmployee) {
      return {
        isValid: false,
        message:
          'A user cannot be in both ECommerce-Regular and ECommerce-Employee groups',
      };
    }

    if (!isRegular && !isEmployee) {
      return {
        isValid: false,
        message:
          'A user must be in either ECommerce-Regular or ECommerce-Employee group',
      };
    }

    return { isValid: true, message: null };
  },
};
