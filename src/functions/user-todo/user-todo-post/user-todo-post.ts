import middy from 'middy';
import { putItem } from '@src/database';
import { APIGatewayV2Handler } from '@src/core/types';
import { response } from '@src/services/response.service';
import { TodoTableName, UserTodoDynamo } from '@src/database/models/user-todo.model';
import {
  HttpErrorHandler,
  HttpJsonBodyParserMiddleware,
  ValidateBodyMiddleware
} from '@src/core/middlewares';
import { userTodoPostDTO } from './dto/user-todo-post.dto';

/**
 * @description Lambda function to create user todo in system
 * @param event - The event passed to the handler.
 * @returns ApiGatewayProxyResult - The result of the handler.
 */
const userTodoPost: APIGatewayV2Handler<userTodoPostDTO> = async (event) => {
  const {
    body: { userId, title, description }
  } = event;

  const todoId = Date.now();

  const todoItem: UserTodoDynamo = {
    pk: userId,
    sk: `todo#${todoId}`,
    title,
    description
  };

  await putItem({
    TableName: TodoTableName,
    Item: todoItem
  });

  return response.created({
    todoId
  });
};

export const handler = middy(userTodoPost)
  .use(HttpJsonBodyParserMiddleware())
  .use(ValidateBodyMiddleware(userTodoPostDTO))
  .use(HttpErrorHandler());
