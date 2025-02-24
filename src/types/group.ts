/**
 * Interface for Group.
 * This describes the shape of a Group object.
 * Each Group has the following properties:
 * - id: A unique string identifier for the Group.
 * - name: The name of the Group as a string.
 * - typeid: The type ID of the Group as a number.
 * - typename: The type name of the Group as a string or null.
 * - localid: The local ID of the Group as a string or null.
 * - created: The creation timestamp as a string or null.
 * - updated: The last update timestamp as a string or null.
 */
export interface Group {
  id: string;
  name: string;
  typeid: number;
  typename: string | null;
  localid: string | null;
  created: string | null;
  updated: string | null;
}
