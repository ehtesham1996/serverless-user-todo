import type { Serverless } from 'serverless/aws';

import { pingPong } from './ping-pong';
import { userTodoPut } from './user-todo/user-todo-put';
import { userTodoPost } from './user-todo/user-todo-post';
import { userTodoGetAll } from './user-todo/user-todo-get';
import { userTodoDelete } from './user-todo/user-todo-delete';
import { userTodoGetById } from './user-todo/user-todo-get-id';

export const functions: Serverless['functions'] = {
  /** A Ping-pong api to check server */
  pingPong,

  /** User-Todo Functions */
  userTodoPost,
  userTodoGetById,
  userTodoGetAll,
  userTodoPut,
  userTodoDelete
};
