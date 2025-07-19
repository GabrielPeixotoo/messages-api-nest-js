import { RegexProtocol } from './regex_protocol';

export class OnlyLowercaseLettersRegex implements RegexProtocol {
  execute(str: string): string {
    return str.replace(/[^a-z]/g, '');
  }
}
