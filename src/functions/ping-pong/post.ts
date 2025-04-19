import middy from 'middy';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { HttpErrorHandler } from '@src/core/middlewares';
import { response } from '@src/services/response.service';

/**
 * @description A simple handler to get response from server.
 * @param event - The event passed to the handler.
 * @returns ApiGatewayProxyResult - The result of the handler.
 */
const PingPong: APIGatewayProxyHandler = async (event) => {
  const { body } = event;
  return response.success('Pong', { hello: 'world', body: body || 'empty' });
};

export const handler = middy(PingPong).use(HttpErrorHandler());
