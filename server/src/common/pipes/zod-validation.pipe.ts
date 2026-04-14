import { BadRequestException, Injectable, type PipeTransform } from '@nestjs/common';
import { ZodError, type ZodType } from 'zod';

type ZodDtoClass = {
  new (): object;
  schema: ZodType;
};

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  transform(value: unknown, metadata: { metatype?: unknown }): unknown {
    const metatype = metadata.metatype;

    if (!this.isZodDtoClass(metatype)) {
      return value;
    }

    try {
      const parsedValue = metatype.schema.parse(value);
      return Object.assign(new metatype(), parsedValue);
    } catch (error) {
      if (error instanceof ZodError) {
        const flattenedError = error.flatten();
        const fieldErrors = Object.entries(flattenedError.fieldErrors)
          .filter(([, messages]) => Array.isArray(messages) && messages.length > 0)
          .map(([field, messages]) => ({
            field,
            messages: messages as string[],
          }));

        throw new BadRequestException({
          message: 'Validation failed.',
          formErrors: flattenedError.formErrors,
          fieldErrors,
        });
      }

      throw error;
    }
  }

  private isZodDtoClass(metatype: unknown): metatype is ZodDtoClass {
    if (!metatype || typeof metatype !== 'function') {
      return false;
    }

    return 'schema' in metatype && Boolean((metatype as Partial<ZodDtoClass>).schema);
  }
}
