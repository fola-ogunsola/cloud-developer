import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

const logger = createLogger('TodosAccess')
// TODO: Implement businessLogic

const todoAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils();

export async function getAllTodos(): Promise<TodoItem[]> {
  return todoAccess.getAllTodos()
}

export async function createTodo(
  CreateTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  try {
    const itemId = uuid.v4()

    logger.info('Creating New TODO')

    return await todoAccess.createTodo({
      todoId: itemId,
      userId: userId,
      createdAt: new Date().toISOString(),
      done: false,
      ... CreateTodoRequest

    })
  } catch (err) {
    createError('Unable to create TODO item')
  }

  
  
}

export async function deleteTodo(
  todoId: string,
  userId: string
): Promise<any> {

  if( !(todoAccess.getTodo(userId, todoId)) ) {
    return false;
  }
  logger.info('Deleting Todo ', userId, todoId)
  await todoAccess.deleteTodo(userId, todoId)
  return true;
}


export async function getTodosForUser(
  userId: string
): Promise<TodoItem[]> {
  logger.info('Get todos for user', userId)
  return await todoAccess.getTodosForUser(userId);
}

export async function updateTodo(
  todoId: string,
  userId: string,
  updateTodoRequest: UpdateTodoRequest,
): Promise<any> {

  if( !(todoAccess.getTodo(userId, todoId)) ) {
    return false;
  }

  logger.info('Updating Todo ', userId, todoId);

  await todoAccess.updateTodo(userId, todoId, updateTodoRequest)
  return true;  
}

export async function createAttachmentPresignedUrl(
  todoId : string,
  userId : string
): Promise<any>{
  return await attachmentUtils.generatePreSignedUrl(todoId, userId);
}