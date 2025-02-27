export const GROUP_IDS = {
  ECOMMERCE: {
    EMPLOYEE: 'c94b7a8c-f454-4ebc-bea2-0e683391976c',
    REGULAR: 'fe5301d8-b78a-4e9c-9a8b-e8eb26f498d1',
    SALES_REP: '22cab051-8e19-4664-a6fe-188e177cd7e3',
    DISTRIBUTOR: 'a1e35d2d-e3a8-43e7-8ea1-95d565332318',
    SALES_REP_TYPES: {
      CFP: '2cf5a031-82a8-4d95-a9c2-11900d8b6dd3',
      DNX: 'c133db7e-c600-4648-bd8b-13dad2915ebe',
      SMP: 'fa14db06-4030-4ed1-94aa-a3804bae543e',
    },
  },
} as const;

export const GROUP_TYPES = {
  SYSTEM: 1,
  CUSTOMER: 2,
  ROLE: 3,
  ECOMMERCE: 4,
  CHANNEL: 5,
} as const;

export const GROUP_TYPE_NAMES = {
  [GROUP_TYPES.SYSTEM]: 'System',
  [GROUP_TYPES.CUSTOMER]: 'Customer',
  [GROUP_TYPES.ROLE]: 'Role',
  [GROUP_TYPES.ECOMMERCE]: 'ECommerce',
  [GROUP_TYPES.CHANNEL]: 'Channel',
} as const;

// Type for type-safety when referencing group types
export type GroupType = (typeof GROUP_TYPES)[keyof typeof GROUP_TYPES];
