import middy from 'middy';
import { queryItem } from '@src/database';
import { APIGatewayV2Handler } from '@src/core/types';
import { HttpErrorHandler } from '@src/core/middlewares';
import { response } from '@src/services/response.service';
import { ValidateQueryMiddleware } from '@src/core/middlewares/validate-query.middleware';
import { TodoTableName, UserTodo, UserTodoDynamo } from '@src/database/models/user-todo.model';
import { userTodoQuery } from '../dto/query';

/**
 * @description Lambda function to get all user todos from system
 * @param event - The event passed to the handler.
 * @returns ApiGatewayProxyResult - The result of the handler.
 */
const userTodoGet: APIGatewayV2Handler<null, userTodoQuery> = async (event) => {
  const {
    queryStringParameters: { userId }
  } = event;

  const data = await queryItem<UserTodoDynamo>({
    TableName: TodoTableName,
    KeyConditionExpression: ' pk = :userId AND begins_with(sk, :todo)',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':todo': 'todo#'
    },
    ScanIndexForward: false
  });

  const todoItems: UserTodo[] =
    data.Items?.map((item) => {
      const { pk, sk, ...todoData } = item;
      return {
        userId: pk,
        todoId: sk.split('#')[1],
        ...todoData
      };
    }) || [];

  return response.success('Fetched Data', todoItems);
};

export const handler = middy(userTodoGet)
  .use(HttpErrorHandler())
  .use(ValidateQueryMiddleware(userTodoQuery));
