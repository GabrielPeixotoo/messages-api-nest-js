import { RegexProtocol } from './regex_protocol';

export class RemoveSpacesRegex implements RegexProtocol {
  execute(str: string): string {
    return str.replace(/\s+/g, '');
  }
}
