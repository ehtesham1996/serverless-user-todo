# Serverless User TODO Code Challenge

A serverless implementation of a TODO API using AWS Lambda, DynamoDB, and Serverless Framework.

## Features

- Create, Read, Update, Delete TODO items
- User-specific TODO management
- Serverless architecture
- DynamoDB for data storage
- Input validation using Zod
- Middleware pattern using Middy
- Full TypeScript support

## API Documentation

### Endpoints

#### POST /user-todo
Create a new TODO item
```http
POST /user-todo
Content-Type: application/json

{
  "userId": "user123",
  "title": "Complete project",
  "description": "Finish the serverless project"
}
```

#### GET /user-todo
Get all TODOs for a user
```http
GET /user-todo?userId=user123
```

#### GET /user-todo/{todoId}
Get a specific TODO by ID
```http
GET /user-todo/123?userId=user123
```

#### PUT /user-todo/{todoId}
Update a TODO item
```http
PUT /user-todo/123
Content-Type: application/json

{
  "userId": "user123",
  "title": "Updated title",
  "description": "Updated description"
}
```

#### DELETE /user-todo/{todoId}
Delete a TODO item
```http
DELETE /user-todo/123?userId=user123
```

### Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "message": "Operation message",
  "data": {
    // Response data if any
  }
}
```

## Project Structure
```
.
├── serverless
│   ├── resource             # Contains IAC cloudformation of all required resources
│   ├── iam
│   │   └── index.ts         # IAM policy and role configurations
├── docs
│   └── api-docs.yml         # Api documentation in open api 3.0 
├── src
│   ├── functions            # Lambda configuration and source code folder
│   │   ├── [function-name]
│   │   │   ├── handler.ts   # lambda source code
│   │   │   ├── index.ts     # lambda function Serverless  configuration
│   │   │   └──dto
│   │   │      └── *.dto.ts # zod validations for lambda function
│   │   │
│   │   └── index.ts         # Import/export of all lambda configurations
├── tests                    # Units test for different modules
├── package.json
├── serverless.ts            # Serverless service file
├── tsconfig.json            # Typescript compiler configuration
```

## CI/CD

The ci/cd setup has been done using the github actions.
Upon push into the `main` branch the pipeline get triggered

The pipeline has two stages

- **Test**: runs the unit test before actually deploying the code
```yaml
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16.x]
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v2
        with:
          node-version: ${{ matrix.node-version }}
      - name: Install dependencies
        run: npm ci
      - run: npm test
```

- **Deploy**: deploy to the production using sls deploy comman
```yaml
    deploy:
        name: deploy
        runs-on: ubuntu-latest
        needs: test
        strategy:
        matrix:
            node-version: [16.x]
        steps:
        - uses: actions/checkout@v3
        - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
            node-version: ${{ matrix.node-version }}
        - run: npm ci
        - name: serverless deploy
        uses: serverless/github-action@v3.1
        with:
            args: deploy --stage prod
        env:
            AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
            AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Getting Started

### Prerequisites
- Node.js 16.x or later
- AWS Account with appropriate permissions
- Serverless Framework CLI (`npm install -g serverless`)

### Installation
1. Clone the repository
```bash
git clone <repository-url>
cd serverless-code-challenge
```

2. Install dependencies
```bash
npm install
```

### Local Development
Start the local development server:
```bash
npm run start:dev
```

### Testing
Run unit tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run coverage
```

### Deployment
Deploy to AWS:
```bash
npm run deploy
```

## Technologies Used
- TypeScript
- Node.js
- AWS Lambda
- AWS DynamoDB
- Serverless Framework
- Middy middleware engine
- Zod validation

## Project Dependencies

### Core Dependencies
- `middy`: Middleware engine for AWS Lambda
- `zod`: Schema validation

### Development Dependencies
- `typescript`: TypeScript compiler
- `eslint`: Code linting
- `jest`: Testing framework
- `serverless`: Framework for building serverless applications

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
