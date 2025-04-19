import { z } from 'zod';
import { BadRequestError } from '../errors';

/**
 * @description Generic Zod Validation
 * @param payload | Zod Schema
 */
export const validate = (payload: any, schema: z.AnyZodObject): void => {
  try {
    schema.parse(payload || {});
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      throw new BadRequestError(
        error.errors.map((e) => `${e.path.join(',')} ${e.message}`).join(',')
      );
    }
    throw new BadRequestError((error as Error).message);
  }
};

export default validate;
