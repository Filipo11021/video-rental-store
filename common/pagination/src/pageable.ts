import { Static, Type } from '@sinclair/typebox';

export const pageableSchema = Type.Object({
  size: Type.Number(),
  page: Type.Number(),
});

export type Pageable = Static<typeof pageableSchema>;
