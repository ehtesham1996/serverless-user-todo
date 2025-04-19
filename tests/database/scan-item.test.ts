import { scanItem } from '@src/database';
import { docClient } from '@src/database/functions/dynamodb/doc-client';

jest.mock('@src/database/functions/dynamodb/doc-client');

describe('database - scan item - helper function', () => {
  const mockSend = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (docClient.send as jest.Mock) = mockSend;
  });

  it('success - 200', async () => {
    mockSend.mockResolvedValueOnce({
      Count: 1,
      Items: [{ name: 'JOHN' }],
      ScannedCount: 1
    });

    const params = {
      ExclusiveStartKey: undefined,
      TableName: 'users',
      FilterExpression: '#user_status = :user_status_val',
      ExpressionAttributeNames: {
        '#user_status': 'user_status'
      },
      ExpressionAttributeValues: { ':user_status_val': 'somestatus' }
    };

    await expect(scanItem(params)).resolves.toStrictEqual({
      Items: [{ name: 'JOHN' }],
      LastEvaluatedKey: undefined
    });
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend.mock.calls[0][0].input).toStrictEqual(params);
  });

  it('success - 200 - with limit', async () => {
    mockSend.mockResolvedValueOnce({
      Count: 2,
      Items: [{ name: 'JOHN' }, { name: 'SMITH' }],
      ScannedCount: 2
    });

    const params = {
      TableName: 'users',
      FilterExpression: '#user_status = :user_status_val',
      ExpressionAttributeNames: {
        '#user_status': 'user_status'
      },
      ExpressionAttributeValues: { ':user_status_val': 'somestatus' }
    };

    await expect(scanItem(params, 1)).resolves.toEqual({
      Items: [{ name: 'JOHN' }, { name: 'SMITH' }]
    });
  });

  it('error - 500', async () => {
    mockSend.mockRejectedValueOnce(new Error('Database Error'));

    const params = {
      TableName: 'TEST_TABLE',
      Key: {
        id: '1234567890-1'
      }
    };

    await expect(async () => scanItem(params)).rejects.toThrow('Database error. ERR(DB-02)');
  });
});
