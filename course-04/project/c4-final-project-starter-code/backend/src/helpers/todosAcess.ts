import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'

const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
//import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic


export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly TodosTable = process.env.TODOS_TABLE,
    private readonly TodosIndex = process.env.TODOS_CREATED_AT_INDEX
    ) {
  }

  async getAllTodos(): Promise<TodoItem[]> {
    logger.info('Getting all todos')

    const result = await this.docClient.scan({
      TableName: this.TodosTable
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    logger.info('Creating Todo ', todo.todoId)
    await this.docClient.put({
      TableName: this.TodosTable,
      Item: todo
    }).promise()
    logger.info('Done Creating Todo ', todo.todoId)
    return todo
  }

  async deleteTodo(userId, todoId): Promise<any> {
    logger.info('Deleting Todo item ', userId, todoId)
    await this.docClient.delete({
        TableName: this.TodosTable,
        Key : {
          userId,
          todoId 
        }
    }).promise()
  }

  async getTodosForUser(userId): Promise<TodoItem[]> {
    logger.info('Getting Todo Item', userId)
    let result = await this.docClient.query({
        TableName: this.TodosTable,
        IndexName: this.TodosIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async getTodo(userId, todoId): Promise<TodoItem> {
    let result = await this.docClient.get({
        TableName: this.TodosTable,
        Key : {
            userId,
            todoId
        }
    }).promise()

    const item = result.Item
    return item as TodoItem
  }

  async updateTodo(userId, todoId, updatedTodo): Promise<any> {
    logger.info('Update Todo item ', userId, todoId);
    await this.docClient.update({
      TableName: this.TodosTable,
      Key: {
          todoId,
          userId
      },
      UpdateExpression: 'set #name = :n, #dueDate = :due, #done = :d',
      ExpressionAttributeValues: {
          ':n': updatedTodo.name,
          ':due': updatedTodo.dueDate,
          ':d': updatedTodo.done
      },
      ExpressionAttributeNames: {
          '#name': 'name',
          '#dueDate': 'dueDate',
          '#done': 'done'
      }
    }).promise()
  }
  

}



function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
