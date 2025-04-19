export const dynamodb = {
  stages: ['dev'],
  start: {
    port: 8000,
    inMemory: true,
    migrate: true,
    convertEmptyValues: true
  }
};
