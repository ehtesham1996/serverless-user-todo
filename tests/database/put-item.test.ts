import { putItem } from '@src/database';
import { docClient } from '@src/database/functions/dynamodb/doc-client';

jest.mock('@src/database/functions/dynamodb/doc-client');

describe('database - put item - helper function', () => {
  const mockSend = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (docClient.send as jest.Mock) = mockSend;
  });

  it('success - 200', async () => {
    mockSend.mockResolvedValueOnce({});

    const params = {
      TableName: 'TEST_TABLE',
      Item: {
        id: '1234567890-1',
        hello: 'world'
      }
    };
    await putItem(params);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend.mock.calls[0][0].input).toEqual(params);
  });

  it('error - 500', async () => {
    mockSend.mockRejectedValueOnce(new Error('Some error'));

    const params = {
      TableName: 'TEST_TABLE',
      Item: {
        id: '1234567890-1',
        hello: 'world'
      }
    };

    await expect(async () => putItem(params)).rejects.toThrow('Database error. ERR(DB-02)');
  });
});
