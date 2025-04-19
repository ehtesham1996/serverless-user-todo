import { z } from 'zod';
import { MiddyHandlerLambda } from '../types/middy-handler.type';
import { validate } from '../utils';

export const ValidateQueryMiddleware: middy.Middleware<z.AnyZodObject, any> = (schema) => {
  const middlewareObject: middy.MiddlewareObject<any, any> = {
    before: async (handler: MiddyHandlerLambda): Promise<any> => {
      const { queryStringParameters } = handler.event;
      validate(queryStringParameters, schema as z.AnyZodObject);
    }
  };
  return middlewareObject;
};
