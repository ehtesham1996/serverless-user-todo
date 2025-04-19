import middy from 'middy';
import { getItem } from '@src/database';
import { APIGatewayV2Handler } from '@src/core/types';
import { response } from '@src/services/response.service';
import { TodoTableName, UserTodo, UserTodoDynamo } from '@src/database/models/user-todo.model';
import {
  HttpErrorHandler,
  ValidateQueryMiddleware,
  ValidatePathMiddleware
} from '@src/core/middlewares';
import { userTodoPathParameter } from '../dto/path';
import { userTodoQuery } from '../dto/query';

/**
 * @description Lambda function to get user todo by id from system
 * @param event - The event passed to the handler.
 * @returns ApiGatewayProxyResult - The result of the handler.
 */
const userTodoGetId: APIGatewayV2Handler<null, userTodoQuery, userTodoPathParameter> = async (
  event
) => {
  const {
    pathParameters: { todoId },
    queryStringParameters: { userId }
  } = event;

  const data = await getItem<UserTodoDynamo>({
    TableName: TodoTableName,
    Key: {
      pk: userId,
      sk: `todo#${todoId}`
    }
  });

  const { pk, sk, ...todoData } = data;
  const todoItem: UserTodo = {
    userId: pk,
    todoId: sk.split('#')[1],
    ...todoData
  };

  return response.success('Fetched Data', todoItem);
};

export const handler = middy(userTodoGetId)
  .use(HttpErrorHandler())
  .use(ValidateQueryMiddleware(userTodoQuery))
  .use(ValidatePathMiddleware(userTodoPathParameter));
