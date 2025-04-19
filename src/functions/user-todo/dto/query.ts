import { z } from 'zod';

export const userTodoQuery = z
  .object({
    userId: z.string()
  })
  .required();

export type userTodoQuery = z.infer<typeof userTodoQuery>;
