import { Group } from '@/types/group';
import { GROUP_IDS, GROUP_TYPES } from '@/config/groups';

export const groupUtils = {
  /**
   * Check if user is in a specific group by ID
   */
  isInGroup: (groups: Group[], groupId: string): boolean => {
    return groups.some(group => group.id === groupId);
  },

  /**
   * Check if user is in any group of a specific type
   */
  hasGroupType: (groups: Group[], typeId: number): boolean => {
    return groups.some(group => group.typeid === typeId);
  },

  /**
   * Check if user has customer group
   */
  hasCustomerGroup: (groups: Group[]): boolean => {
    return groupUtils.hasGroupType(groups, GROUP_TYPES.CUSTOMER);
  },

  /**
   * Check if user has any of the specified groups
   */
  hasAnyGroup: (groups: Group[], groupIds: string[]): boolean => {
    return groupIds.some(id => groupUtils.isInGroup(groups, id));
  },

  /**
   * Check if user has all of the specified groups
   */
  hasAllGroups: (groups: Group[], groupIds: string[]): boolean => {
    return groupIds.every(id => groupUtils.isInGroup(groups, id));
  },

  /**
   * Count how many of the specified groups the user has
   */
  countMatchingGroups: (groups: Group[], groupIds: string[]): number => {
    return groupIds.filter(id => groupUtils.isInGroup(groups, id)).length;
  },

  /**
   * Check if email domain matches any in the allowed list
   */
  isAllowedDomain: (email: string, allowedDomains: string[]): boolean => {
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
  },
};

/**
 * Type-safe group validation builder
 */
export const createGroupValidator = (groups: Group[]) => ({
  isEmployee: () => groupUtils.isInGroup(groups, GROUP_IDS.ECOMMERCE.EMPLOYEE),

  isRegular: () => groupUtils.isInGroup(groups, GROUP_IDS.ECOMMERCE.REGULAR),

  isSalesRep: () => groupUtils.isInGroup(groups, GROUP_IDS.ECOMMERCE.SALES_REP),

  isDistributor: () =>
    groupUtils.isInGroup(groups, GROUP_IDS.ECOMMERCE.DISTRIBUTOR),

  hasSalesRepType: () =>
    groupUtils.hasAnyGroup(groups, [
      GROUP_IDS.ECOMMERCE.SALES_REP_TYPES.CFP,
      GROUP_IDS.ECOMMERCE.SALES_REP_TYPES.DNX,
      GROUP_IDS.ECOMMERCE.SALES_REP_TYPES.SMP,
    ]),

  hasCustomers: () => groupUtils.hasCustomerGroup(groups),
});
