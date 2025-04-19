import { GetCommand, GetCommandInput } from '@aws-sdk/lib-dynamodb';
import { BadRequestError, DatabaseError, HttpError } from '@src/core/errors';
import { docClient } from './doc-client';

export async function getItem<T>(params: GetCommandInput): Promise<T> {
  try {
    const response = await docClient.send(new GetCommand(params));
    const item = response.Item;
    if (!item) throw new BadRequestError('Invalid item specified to be fetched.');
    return item as T;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new DatabaseError();
  }
}
