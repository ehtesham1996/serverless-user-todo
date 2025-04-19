import { queryItem } from '@src/database';
import { docClient } from '@src/database/functions/dynamodb/doc-client';

jest.mock('@src/database/functions/dynamodb/doc-client');

describe('database - query item - helper function', () => {
  const mockSend = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (docClient.send as jest.Mock) = mockSend;
  });

  it('success - 200', async () => {
    mockSend.mockResolvedValueOnce({
      Count: 1,
      Items: [
        {
          pk: '123e4567-e89b',
          title: 'Title'
        }
      ]
    });

    const params = {
      ExclusiveStartKey: undefined,
      TableName: 'tableName',
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: { ':pk': '123e4567-e89b' }
    };

    await expect(queryItem(params)).resolves.toStrictEqual({
      Items: [{ pk: '123e4567-e89b', title: 'Title' }],
      LastEvaluatedKey: undefined
    });
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend.mock.calls[0][0].input).toStrictEqual(params);
  });

  it('success - 200 - with limit', async () => {
    mockSend.mockResolvedValueOnce({
      Count: 2,
      Items: [
        {
          pk: '123e4567-e89b',
          title: 'Title'
        },
        {
          pk: '123e4567-e89b1',
          title: 'Title1'
        }
      ]
    });

    const params = {
      TableName: 'tableName',
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: { ':pk': '123e4567-e89b' }
    };

    await expect(queryItem(params, 1)).resolves.toStrictEqual({
      Items: [
        { pk: '123e4567-e89b', title: 'Title' },
        { pk: '123e4567-e89b1', title: 'Title1' }
      ],
      LastEvaluatedKey: undefined
    });
  });

  it('error - 500', async () => {
    mockSend.mockRejectedValueOnce(new Error('Database Error'));

    const params = {
      TableName: 'tableName',
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: { ':pk': '123e4567-e89b' }
    };

    await expect(async () => queryItem(params)).rejects.toThrow('Database error. ERR(DB-02)');
  });
});
