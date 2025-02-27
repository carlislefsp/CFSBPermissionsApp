import { BusinessRule, RuleContext, ValidationResult } from '@/types/rules';
import { createGroupValidator } from '@/lib/group-utils';
import { GROUP_IDS } from '@/config/groups';

// Track number of validation failures logged
let failureLogsCount = 0;
const MAX_FAILURE_LOGS = 10;

// Debug utility that only logs validation failures
function debugValidation(context: {
  user: { email: string };
  groups: Array<{ id: string; name: string }>;
  result: { isRegular: boolean; isEmployee: boolean };
}) {
  // Only log if validation would fail and we haven't exceeded the limit
  if (
    !(context.result.isRegular || context.result.isEmployee) &&
    failureLogsCount < MAX_FAILURE_LOGS
  ) {
    failureLogsCount++;

    console.group(
      `🔍 ECommerce Group Rule Validation Failed (${failureLogsCount}/${MAX_FAILURE_LOGS}): ${context.user.email}`,
    );
    console.log('Expected Groups:');
    console.log('- Regular:', GROUP_IDS.ECOMMERCE.REGULAR);
    console.log('- Employee:', GROUP_IDS.ECOMMERCE.EMPLOYEE);
    console.log('\nUser Groups:');
    context.groups.forEach(g => console.log(`- ${g.name} (${g.id})`));
    console.log('\nValidation Results:');
    console.log('- Is Regular:', context.result.isRegular);
    console.log('- Is Employee:', context.result.isEmployee);
    console.groupEnd();

    // Log a final message when we hit the limit
    if (failureLogsCount === MAX_FAILURE_LOGS) {
      console.log(
        '⚠️ Max validation failure logs reached. Further failures will not be logged.',
      );
    }
  }
}

// Reset the counter when the module is re-imported
if (typeof window !== 'undefined') {
  // Only reset in browser environment
  window.addEventListener('load', () => {
    failureLogsCount = 0;
  });
}

export const ecommerceGroupRule: BusinessRule = {
  id: 'ECOMMERCE_GROUP_RULE',
  name: 'ECommerce Group Membership Rule',
  description:
    'Users must be in exactly one of: ECommerce-Regular or ECommerce-Employee',

  validate: ({ user, groups }: RuleContext): ValidationResult => {
    const validator = createGroupValidator(groups);
    const isRegular = validator.isRegular();
    const isEmployee = validator.isEmployee();

    // Debug validation failures only
    debugValidation({
      user,
      groups,
      result: { isRegular, isEmployee },
    });

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
