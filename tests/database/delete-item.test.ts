import { deleteItem } from '@src/database';
import { docClient } from '@src/database/functions/dynamodb/doc-client';

jest.mock('@src/database/functions/dynamodb/doc-client');

describe('database - delete item - helper function', () => {
  const mockSend = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (docClient.send as jest.Mock) = mockSend;
  });

  it('success - 200', async () => {
    mockSend.mockResolvedValueOnce({});

    const params = {
      TableName: 'TEST_TABLE',
      Key: {
        id: '1234567890-1'
      }
    };

    await deleteItem(params);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend.mock.calls[0][0].input).toStrictEqual(params);
  });

  it('error - 400', async () => {
    const error = { name: 'ValidationException' };
    mockSend.mockRejectedValueOnce(error);

    const params = {
      TableName: 'TEST_TABLE',
      Key: {
        id: '1234567890-1'
      }
    };

    await expect(async () => deleteItem(params)).rejects.toThrow(
      'Unable to delete non existent item ERR(BR-01)'
    );
  });

  it('error - 500', async () => {
    mockSend.mockRejectedValueOnce(new Error('Database Error'));

    const params = {
      TableName: 'TEST_TABLE',
      Key: {
        id: '1234567890-1'
      }
    };

    await expect(async () => deleteItem(params)).rejects.toThrow('Database error. ERR(DB-02)');
  });
});
