import { User } from './user';
import { Group } from './group';

export interface ValidationResult {
  isValid: boolean;
  message: string | null;
}

export interface RuleContext {
  user: User;
  groups: Group[];
}

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  validate: (context: RuleContext) => ValidationResult;
}
