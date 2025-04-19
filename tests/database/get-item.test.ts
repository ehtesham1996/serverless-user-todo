import { getItem } from '@src/database';
import { docClient } from '@src/database/functions/dynamodb/doc-client';

jest.mock('@src/database/functions/dynamodb/doc-client');

describe('database - get item - helper function', () => {
  const mockSend = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (docClient.send as jest.Mock) = mockSend;
  });

  it('success - 200', async () => {
    mockSend.mockResolvedValueOnce({
      Item: {
        id: '123456789-0',
        field: 'value1'
      }
    });

    const params = {
      TableName: 'TEST_TABLE',
      Key: {
        id: '1234567890-1'
      }
    };
    await expect(getItem(params)).resolves.toStrictEqual({ id: '123456789-0', field: 'value1' });
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend.mock.calls[0][0].input).toEqual(params);
  });

  it('throw error when invalied item specified', async () => {
    mockSend.mockResolvedValueOnce({});

    const params = {
      TableName: 'TEST_TABLE',
      Key: {
        id: '1234567890-1'
      }
    };
    await expect(async () => getItem(params)).rejects.toThrow(
      'Invalid item specified to be fetched. ERR(BR-01)'
    );
  });

  it('throw when database is not responding', async () => {
    mockSend.mockRejectedValueOnce(new Error('some error'));

    const params = {
      TableName: 'TEST_TABLE',
      Key: {
        id: '1234567890-1'
      }
    };

    await expect(async () => getItem(params)).rejects.toThrow('Database error. ERR(DB-02)');
  });
});
