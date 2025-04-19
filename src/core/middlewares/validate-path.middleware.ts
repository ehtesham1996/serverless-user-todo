import { z } from 'zod';
import { MiddyHandlerLambda } from '../types/middy-handler.type';
import { validate } from '../utils';

export const ValidatePathMiddleware: middy.Middleware<z.AnyZodObject, any> = (schema) => {
  const middlewareObject: middy.MiddlewareObject<any, any> = {
    before: async (handler: MiddyHandlerLambda): Promise<any> => {
      const { pathParameters } = handler.event;
      validate(pathParameters, schema as z.AnyZodObject);
    }
  };
  return middlewareObject;
};
