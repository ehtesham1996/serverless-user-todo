import type { Serverless } from 'serverless/aws';
import { GatewayResponse } from './apigateway/gateway-response';
import { DynamoDBTables } from './dynamodb';

export const resources: Serverless['resources'] = {
  Resources: {
    GatewayResponse,
    ...DynamoDBTables
  }
};
