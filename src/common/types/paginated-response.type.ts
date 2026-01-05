export type PaginatedResponse<Entity> = {
  items: Entity[];
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
};
