import type { AwsFunctionHandler } from 'serverless/aws';
import { cors } from '../../../serverless/configs';
import { HTTP } from '../../core/types/http-methods.enum';

export const pingPong: AwsFunctionHandler = {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/post.handler`,
  events: [
    {
      http: {
        method: HTTP.GET,
        path: '/ping',
        cors
      }
    }
  ]
};
