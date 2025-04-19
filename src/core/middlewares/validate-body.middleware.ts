import { z } from 'zod';
import { MiddyHandlerLambda } from '../types/middy-handler.type';
import { validate } from '../utils';

export const ValidateBodyMiddleware: middy.Middleware<z.AnyZodObject, any> = (schema) => {
  const middlewareObject: middy.MiddlewareObject<any, any> = {
    before: async (handler: MiddyHandlerLambda): Promise<any> => {
      const { body } = handler.event;
      validate(body, schema as z.AnyZodObject);
    }
  };
  return middlewareObject;
};
export default ValidateBodyMiddleware;
