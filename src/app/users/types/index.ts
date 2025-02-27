import { User } from '@/types/user';

export interface LazyUserListItemProps {
  user: User;
}

export interface SearchTerm {
  id: string;
  term: string;
}

export interface UserListProps {
  filterFn?: (user: User) => boolean;
  currentTab?: 'customers' | 'employees';
  onTabChange?: (tab: 'customers' | 'employees') => void;
  allUsers?: {
    customers: User[];
    employees: User[];
  };
  selectedUser?: User;
  onSelectUser: (user: User | undefined) => void;
  searchFilteredUsers: User[];
  searchTerms: SearchTerm[];
  onSearch: (filtered: User[], searchTerm?: string) => void;
  onRemoveSearchTerm: (termId: string) => void;
}

// Tab type for user categories
export type UserTab = 'customers' | 'employees';

// Search related types
export interface UserSearchState {
  terms: SearchTerm[];
  filtered: User[];
}
