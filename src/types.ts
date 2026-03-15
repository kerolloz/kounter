import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

export type Env = z.infer<typeof envSchema>;

export const keyCountPairSchema = z.object({
  key: z.string().min(1),
  count: z.number().int().nonnegative(),
});

export type KeyCountPair = z.infer<typeof keyCountPairSchema>;

export const badgeQuerySchema = z.object({
  style: z
    .enum(['flat', 'plastic', 'flat-square', 'for-the-badge', 'social'])
    .default('flat'),
  label: z.string().optional(),
  labelColor: z.string().default(''),
  color: z.string().default(''),
  cntPrefix: z.string().default(''),
  cntSuffix: z.string().default(''),
  silent: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
});

export const keyParamSchema = z.object({
  key: z.string().min(1),
});
