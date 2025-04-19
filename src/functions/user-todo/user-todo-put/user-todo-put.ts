import middy from 'middy';
import { APIGatewayV2Handler } from '@src/core/types';
import { response } from '@src/services/response.service';
import { buildUpdateExpression, updateItem } from '@src/database';
import { TodoTableName, UserTodo } from '@src/database/models/user-todo.model';
import {
  HttpErrorHandler,
  HttpJsonBodyParserMiddleware,
  ValidatePathMiddleware,
  ValidateBodyMiddleware
} from '@src/core/middlewares';
import { userTodoPutDTO } from './dto/user-todo-put.dto';
import { userTodoPathParameter } from '../dto/path';

/**
 * @description Lambda function to update user todo in system
 * @param event - The event passed to the handler.
 * @returns ApiGatewayProxyResult - The result of the handler.
 */
const userTodoPut: APIGatewayV2Handler<userTodoPutDTO, null, userTodoPathParameter> = async (
  event
) => {
  const {
    pathParameters: { todoId },
    body: { userId, ...todoData }
  } = event;

  const todoItem = await updateItem({
    TableName: TodoTableName,
    ...buildUpdateExpression(
      {
        pk: userId,
        sk: `todo#${todoId}`
      },
      todoData
    ),
    ReturnValues: 'ALL_NEW'
  });

  const todo: UserTodo = {
    userId: todoItem.Attributes?.pk,
    todoId: todoItem.Attributes?.sk.split('#')[1],
    title: todoItem.Attributes?.title,
    description: todoItem.Attributes?.description
  };

  return response.success('Todo updated', todo);
};

export const handler = middy(userTodoPut)
  .use(HttpErrorHandler())
  .use(HttpJsonBodyParserMiddleware())
  .use(ValidateBodyMiddleware(userTodoPutDTO))
  .use(ValidatePathMiddleware(userTodoPathParameter));
