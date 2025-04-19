import type { IamRoleStatement, Serverless } from 'serverless/aws';
import { DynamoDBTables } from '../resources/dynamodb';

const DynamoDBStatement: IamRoleStatement = {
  Effect: 'Allow',
  Action: [
    'dynamodb:DescribeTable',
    'dynamodb:Query',
    'dynamodb:Scan',
    'dynamodb:GetItem',
    'dynamodb:PutItem',
    'dynamodb:UpdateItem',
    'dynamodb:DeleteItem',
    'dynamodb:BatchWriteItem'
  ],
  Resource: Object.keys(DynamoDBTables).map((tablename) => ({
    'Fn::Join': ['', [{ 'Fn::GetAtt': [tablename, 'Arn'] }, '*']]
  }))
};

const lambdaStatement: IamRoleStatement = {
  Effect: 'Allow',
  Action: ['lambda:InvokeFunction'],
  Resource: '*'
};

export const iam: Serverless['provider']['iam'] = {
  role: {
    name: '${self:service}-${self:provider.stage}-execution-role',
    statements: [DynamoDBStatement, lambdaStatement]
  }
};
