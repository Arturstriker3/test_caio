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
        throw new BadRequestException(error.flatten());
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
