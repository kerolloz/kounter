import { z } from 'zod';

export const keyCountPair = z.object({ count: z.number(), key: z.string() });
export const kounterRequestSchema = {
  params: z.object({
    key: z.string().describe('The key to get the count of.'),
  }),
  querystring: z.object({
    style: z
      .enum(['flat', 'plastic', 'flat-square', 'for-the-badge', 'social'])
      .default('flat')
      .describe('Set the style of the badge.'),
    label: z
      .string()
      .optional()
      .describe('Set the left-hand-side text. Defaults to the key.'),
    labelColor: z
      .string()
      .default('')
      .describe('Set background color of the left part.'),
    color: z
      .string()
      .default('')
      .describe('Set background color of the right part.'),
    cntPrefix: z
      .string()
      .default('')
      .describe('The prefix to display before the counter value.'),
    cntSuffix: z
      .string()
      .default('')
      .describe('The suffix to display after the counter value.'),
    silent: z
      .enum(['true', 'false'])
      .default('false')
      .transform((v) => v === 'true')
      .describe('Set to true to disable incrementing the counter.'),
  }),
};

export type TKeyCountPair = z.infer<typeof keyCountPair>;
