import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { DatabaseError } from '@src/core/errors';
import { docClient } from './doc-client';

export async function putItem(params: PutCommandInput): Promise<void> {
  try {
    await docClient.send(new PutCommand(params));
  } catch (error) {
    throw new DatabaseError();
  }
}
