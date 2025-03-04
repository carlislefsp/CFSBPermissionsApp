export * from './employee-domain';
export * from './ecommerce-group-rule';
export * from './regular-user-role-rule';
export * from './sales-rep-type-rule';
export * from './customer-requirement-rule';
export * from './customer-role-rule';

import { BusinessRule } from '@/types/rules';
import { employeeDomainRule } from './employee-domain';
import { ecommerceGroupRule } from './ecommerce-group-rule';
import { regularUserRoleRule } from './regular-user-role-rule';
import { salesRepTypeRule } from './sales-rep-type-rule';
import { customerRequirementRule } from './customer-requirement-rule';
import { customerRoleRule } from './customer-role-rule';

export const businessRules: BusinessRule[] = [
  employeeDomainRule,
  ecommerceGroupRule,
  regularUserRoleRule,
  salesRepTypeRule,
  customerRequirementRule,
  customerRoleRule,
];
