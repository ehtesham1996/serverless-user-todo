import middy from 'middy';
import { HttpError } from '@src/core/errors';
import { response } from '@src/services/response.service';
import { MiddyHandlerLambda } from '../types/middy-handler.type';

export const HttpErrorHandler: middy.Middleware<any, any> = () => {
  const middlewareObject: middy.MiddlewareObject<any, any> = {
    onError: async (handler: MiddyHandlerLambda): Promise<any> => {
      const { error: handlerError } = handler;
      console.error('Error Occured =>>', handlerError.message);
      console.error('Stack =>>', handlerError.stack);

      handler.response =
        handlerError instanceof HttpError
          ? response.error(handlerError.statusCode, handlerError.message)
          : response.error();
    }
  };
  return middlewareObject;
};

export default HttpErrorHandler;
