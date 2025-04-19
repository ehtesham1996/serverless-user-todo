import { ReturnValue } from '@aws-sdk/client-dynamodb';
import { updateItem, buildUpdateExpression } from '@src/database';
import { docClient } from '@src/database/functions/dynamodb/doc-client';

jest.mock('@src/database/functions/dynamodb/doc-client');

describe('database - update item - helper function', () => {
  const mockSend = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (docClient.send as jest.Mock) = mockSend;
  });

  it('success - 200', async () => {
    mockSend.mockResolvedValueOnce({});

    const params = {
      TableName: 'TableName',
      Key: { pk: '12345', sk: 'details' },
      UpdateExpression: 'set #status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': true },
      ReturnValues: ReturnValue.ALL_NEW
    };

    await updateItem(params);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend.mock.calls[0][0].input).toStrictEqual(params);
  });

  it('error - 400', async () => {
    const error = { name: 'ConditionalCheckFailedException' };
    mockSend.mockRejectedValueOnce(error);

    const params = {
      TableName: 'TEST_TABLE',
      Key: {
        id: '1234567890-1',
        hello: 'world'
      }
    };

    await expect(async () => updateItem(params)).rejects.toThrow(
      'Invalid id specified to be updated ERR(NF-01)'
    );
  });

  it('error - 500', async () => {
    const error = new Error('Some error');
    mockSend.mockRejectedValueOnce(error);

    const params = {
      TableName: 'TableName',
      Key: { pk: '12345', sk: 'details' },
      UpdateExpression: 'set #status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': true },
      ReturnValues: ReturnValue.ALL_NEW
    };
    await expect(async () => updateItem(params)).rejects.toThrow('Database error. ERR(DB-02)');
  });

  it('success - build expression', async () => {
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2020-01-01T00:00:00.000Z');

    expect(buildUpdateExpression({ pk: '123456' }, { hello: 'world', obj2: 'data' })).toStrictEqual(
      {
        Key: { pk: '123456' },
        UpdateExpression: 'set updatedAt = :updatedAt, #hello = :hello, #obj2 = :obj2 ',
        ExpressionAttributeNames: { '#hello': 'hello', '#obj2': 'obj2' },
        ExpressionAttributeValues: {
          ':updatedAt': '2020-01-01T00:00:00.000Z',
          ':pk': '123456',
          ':hello': 'world',
          ':obj2': 'data'
        },
        ConditionExpression: 'pk = :pk'
      }
    );
  });
  it('failure - build expression', async () => {
    expect(() => buildUpdateExpression({ pk: '123456', sk: '123456' }, {})).toThrow(
      'Please specify attributes to be updated ERR(BR-01)'
    );
  });
});
