import {
  Handler,
  APIGatewayProxyResult,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  APIGatewayProxyEventBase,
  APIGatewayProxyEventPathParameters,
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayProxyEventQueryStringParameters
} from 'aws-lambda';

export type APIGatewayAuthenticatedEvent =
  APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>;

export type APIGatewayAuthenticatedHandler = Handler<
  APIGatewayAuthenticatedEvent,
  APIGatewayProxyResult
>;

type ValidatedAPIGatewayProxyEvent<S, T, U> = Omit<
  APIGatewayProxyEventV2,
  'body' | 'queryStringParameters' | 'pathParameters'
> & {
  body: S;
  queryStringParameters: T;
  pathParameters: U;
};

export type APIGatewayV2Handler<
  S = string,
  T = APIGatewayProxyEventQueryStringParameters,
  U = APIGatewayProxyEventPathParameters
> = Handler<ValidatedAPIGatewayProxyEvent<S, T, U>, APIGatewayProxyResultV2>;
