/* eslint-disable max-classes-per-file */

import { HttpError } from './http.error';

/**
 * @description database error description class.This defines
 *              the database error with message DB-01 code
 */
export class DatabaseConnectionError extends HttpError {
  constructor() {
    super('Database connection error. ERR(DB-01)', 500);
  }
}

export class DatabaseError extends HttpError {
  constructor() {
    super('Database error. ERR(DB-02)', 500);
  }
}
