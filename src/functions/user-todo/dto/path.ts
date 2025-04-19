import { z } from 'zod';

export const userTodoPathParameter = z.object({
  todoId: z.string()
});

export type userTodoPathParameter = z.infer<typeof userTodoPathParameter>;
