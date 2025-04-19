import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { DatabaseError } from '@src/core/errors';
import { docClient } from './doc-client';

export async function queryItem<T>(
  params: QueryCommandInput,
  limit?: number
): Promise<{
  Items: T[];
  LastEvaluatedKey: Record<string, any>;
}> {
  try {
    let { ExclusiveStartKey } = params;
    const results: T[] = [];
    do {
      const queryParams = { ...params, ExclusiveStartKey };
      const response = await docClient.send(new QueryCommand(queryParams));
      const items = response.Items || [];
      results.push(...(items as T[]));
      ExclusiveStartKey = response.LastEvaluatedKey;
      if (limit && results.length >= limit) {
        break;
      }
    } while (ExclusiveStartKey);
    return {
      Items: results,
      LastEvaluatedKey: ExclusiveStartKey as Record<string, any>
    };
  } catch (error: any) {
    throw new DatabaseError();
  }
}
