import type { AwsFunctionHandler } from 'serverless/aws';
import { cors } from '../../../../serverless/configs';
import { HTTP } from '../../../core/types/http-methods.enum';

export const userTodoPost: AwsFunctionHandler = {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/user-todo-post.handler`,
  events: [
    {
      http: {
        method: HTTP.POST,
        path: '/user-todo',
        cors
      }
    }
  ]
};
