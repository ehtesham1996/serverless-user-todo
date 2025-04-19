import { APIGatewayProxyResult } from 'aws-lambda';
import { CustomResponse } from '@src/core/types/custom-response.type';

const defaultHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': '*'
};

const _buildResponse = (
  statusCode: number,
  body: CustomResponse,
  headers: { [header: string]: string | number | boolean } = defaultHeaders,
  multiValueHeaders?: { [header: string]: (string | number | boolean)[] },
  isBase64Encoded?: boolean
): APIGatewayProxyResult => ({
  statusCode,
  body: JSON.stringify(body),
  headers,
  multiValueHeaders,
  isBase64Encoded
});

const success = (message = 'OK', data?: any): APIGatewayProxyResult =>
  _buildResponse(200, {
    success: true,
    message,
    data
  });

const created = (data?: any): APIGatewayProxyResult =>
  _buildResponse(201, {
    success: true,
    message: 'Created',
    data
  });

const error = (
  statusCode = 500,
  message = 'Internal server error occurred'
): APIGatewayProxyResult =>
  _buildResponse(statusCode, {
    error: true,
    success: false,
    message
  });

const unAuthorized = (message = 'Unauthorized'): APIGatewayProxyResult =>
  _buildResponse(401, {
    error: true,
    success: false,
    message
  });

export const response = {
  success,
  created,
  error,
  unAuthorized
};

export default response;
