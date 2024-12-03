import { Static, TSchema, Type } from '@sinclair/typebox';

export function pageSchema<T extends TSchema>(itemSchema: T) {
  return Type.Object({
    page: Type.Number(),
    size: Type.Number(),
    totalItems: Type.Number(),
    items: Type.Array(itemSchema),
  });
}

/* 
TypeBox's Static<T> utility has limitations with generic type inference,
so we manually construct the Page type by:
1. Taking all properties except 'items' from the schema
2. Adding back 'items' with the correct generic type T[]
*/
export type Page<T> = Omit<Static<ReturnType<typeof pageSchema>>, 'items'> & {
  items: T[];
};
