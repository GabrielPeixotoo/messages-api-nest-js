import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }

    const parsedValue = Number(value);

    if (isNaN(parsedValue)) {
      throw new BadRequestException(`Param id is not a string.`);
    }

    if (parsedValue < 0) {
      throw new BadRequestException(
        `ParseIntIdPipe expects a positive number.`,
      );
    }

    return parsedValue;
  }
}
