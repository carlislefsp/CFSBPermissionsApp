import { Group } from './group';

/**
 * Interface for User.
 * This describes the shape of a User object.
 * Each User has the following properties:
 * - oid: A unique string identifier for the User.
 * - username: The username as a string.
 * - firstname: The first name of the User (optional).
 * - lastname: The last name of the User (optional).
 * - email: The email of the User.
 * - country: The country of the User (optional).
 * - created: The creation timestamp (optional).
 * - updated: The last update timestamp (optional).
 * - groups: Array of associated Groups (optional).
 */
export interface User {
  oid: string;
  username: string;
  firstname?: string;
  lastname?: string;
  email: string;
  country?: string;
  created?: string;
  updated?: string;
  groups?: Group[];
}

/**
 * Interface for GroupUserPermission.
 * Represents the relationship between a user, group, and permission
 */
export interface GroupUserPermission {
  userid: string;
  groupid: string;
  permissionid: string;
  created?: string;
  updated?: string;
}
