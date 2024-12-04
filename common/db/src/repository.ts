import { randomUUID } from 'crypto';
import { Knex } from 'knex';

export type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export function createBaseEntity(): BaseEntity {
  return {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export type Repository<
  Entity extends object,
  IdColumn extends keyof Entity,
  Id = Entity[IdColumn],
> = {
  save(entity: Entity): Promise<void>;
  delete(id: Id): Promise<void>;
  update(id: Id, entity: Partial<Entity>): Promise<void>;
  findMany(obj?: { page: number; size: number }): Promise<Entity[]>;
  findOneBy<T extends keyof Entity>(
    field: T,
    value: Entity[T],
  ): Promise<Entity | undefined>;
};

export function createInMemoryRepository<
  Entity extends object,
  IdColumn extends keyof Entity,
>({
  idColumn,
  store,
}: {
  idColumn: IdColumn;
  store: Map<Entity[IdColumn], Entity>;
}): Repository<Entity, IdColumn> {
  return {
    async save(entity) {
      store.set(entity[idColumn], entity);
    },

    async delete(id) {
      store.delete(id);
    },

    async update(id, entity) {
      const existing = store.get(id);
      if (existing) {
        store.set(id, { ...existing, ...entity });
      } else {
        throw Error('Cannot update entity - no existing entity found with the provided ID');
      }
    },

    async findMany(obj) {
      const values = Array.from(store.values());

      if (!obj) {
        return values;
      }

      const { page, size } = obj;
      const start = (page - 1) * size;
      return values.slice(start, start + size);
    },

    async findOneBy(field, value) {
      const entity = Array.from(store.values()).find((e) => e[field] === value);
      return entity;
    },
  };
}

export function createRepository<
  Entity extends Record<PropertyKey, unknown>,
  IdColumn extends keyof Entity,
>({
  knex,
  idColumn,
  tableName,
}: {
  knex: Knex;
  idColumn: IdColumn;
  tableName: string;
}): Repository<Entity, IdColumn> {
  return {
    async save(entity) {
      await knex(tableName).insert(entity);
    },

    async delete(id) {
      await knex(tableName)
        .where({ [idColumn]: id })
        .delete();
    },

    async update(id, entity) {
      await knex(tableName)
        .where({ [idColumn]: id })
        .update({ ...entity, updatedAt: new Date().toISOString() });
    },

    async findMany(obj) {
      let query = knex<Entity>(tableName);

      if (obj) {
        const { page, size } = obj;
        const offset = (page - 1) * size;
        query = query.offset(offset).limit(size);
      }

      const result = await query;

      return result as Entity[];
    },

    async findOneBy(field, value) {
      const result = (await knex(tableName)
        .select('*')
        .where({ [field]: value })
        .first()) as Entity;
      return result;
    },
  };
}
