import { z } from 'zod';

export const userTodoPostDTO = z
  .object({
    userId: z.string(),
    title: z.string(),
    description: z.string()
  })
  .required();

export type userTodoPostDTO = z.infer<typeof userTodoPostDTO>;
