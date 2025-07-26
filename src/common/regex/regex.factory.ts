import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OnlyLowercaseLettersRegex } from './only-lowercase-letters.regex';
import { RemoveSpacesRegex } from './remove-spaces.regex';

type RegexClassesMap = {
  OnlyLowercaseLettersRegex: OnlyLowercaseLettersRegex;
  RemoveSpacesRegex: RemoveSpacesRegex;
};

export type ClassNames = keyof RegexClassesMap;

@Injectable()
export class RegexFactory {
  create<T extends ClassNames>(className: T): RegexClassesMap[T] {
    switch (className) {
      case 'OnlyLowercaseLettersRegex':
        return new OnlyLowercaseLettersRegex();
      case 'RemoveSpacesRegex':
        return new RemoveSpacesRegex();
      default:
        throw new InternalServerErrorException(
          `No class found for ${className}`,
        );
    }
  }
}
