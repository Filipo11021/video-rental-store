import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const envSchema = Type.Object({
  PORT: Type.String({ minLength: 1 }),
  NODE_ENV: Type.Union([
    Type.Literal('development'),
    Type.Literal('production'),
  ]),
});

export const env = Value.Parse(envSchema, process.env);
