import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const getDocumentClient = (): DynamoDBDocumentClient => {
  const client = new DynamoDBClient(
    process.env.IS_OFFLINE
      ? {
          region: 'localhost',
          endpoint: 'http://0.0.0.0:8000',
          credentials: {
            accessKeyId: 'MockAccessKeyId',
            secretAccessKey: 'MockSecretAccessKey'
          }
        }
      : {}
  );

  return DynamoDBDocumentClient.from(client);
};

export const docClient = getDocumentClient();
