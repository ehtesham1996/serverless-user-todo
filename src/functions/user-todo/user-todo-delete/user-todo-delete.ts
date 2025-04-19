import middy from 'middy';
import { deleteItem } from '@src/database';
import { APIGatewayV2Handler } from '@src/core/types';
import { response } from '@src/services/response.service';
import { TodoTableName } from '@src/database/models/user-todo.model';
import {
  HttpErrorHandler,
  ValidateQueryMiddleware,
  ValidatePathMiddleware
} from '@src/core/middlewares';
import { userTodoPathParameter } from '../dto/path';
import { userTodoQuery } from '../dto/query';

/**
 * @description Lambda function to delete user todo from system
 * @param event - The event passed to the handler.
 * @returns ApiGatewayProxyResult - The result of the handler.
 */
const userTodoDelete: APIGatewayV2Handler<null, userTodoQuery, userTodoPathParameter> = async (
  event
) => {
  const {
    pathParameters: { todoId },
    queryStringParameters: { userId }
  } = event;

  await deleteItem({
    TableName: TodoTableName,
    Key: {
      pk: userId,
      sk: `todo#${todoId}`
    },
    ConditionExpression: 'attribute_exists(pk) AND attribute_exists(sk)'
  });

  return response.success(`Todo ${todoId} removed`);
};

export const handler = middy(userTodoDelete)
  .use(HttpErrorHandler())
  .use(ValidateQueryMiddleware(userTodoQuery))
  .use(ValidatePathMiddleware(userTodoPathParameter));
