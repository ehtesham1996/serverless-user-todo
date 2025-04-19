import type { AwsFunctionHandler } from 'serverless/aws';
import { cors } from '../../../../serverless/configs';
import { HTTP } from '../../../core/types/http-methods.enum';

export const userTodoGetAll: AwsFunctionHandler = {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/user-todo-get.handler`,
  events: [
    {
      http: {
        method: HTTP.GET,
        path: '/user-todo',
        cors
      }
    }
  ]
};
