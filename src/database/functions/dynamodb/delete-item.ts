import { DeleteCommand, DeleteCommandInput } from '@aws-sdk/lib-dynamodb';
import { BadRequestError, DatabaseError } from '@src/core/errors';
import { docClient } from './doc-client';

export async function deleteItem(params: DeleteCommandInput): Promise<void> {
  try {
    await docClient.send(new DeleteCommand(params));
  } catch (error: any) {
    if (error.name === 'ValidationException' || error.name === 'ConditionalCheckFailedException') {
      throw new BadRequestError('Unable to delete non existent item');
    }
    throw new DatabaseError();
  }
}
