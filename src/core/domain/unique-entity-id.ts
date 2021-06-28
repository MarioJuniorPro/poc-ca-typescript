import { nanoid } from 'nanoid';
import { Identifier } from './identifier';

export class UniqueEntityId extends Identifier<string | number> {
  // NOTE allow  number to test hybrid scenarios in the future.
  constructor(id?: string | number) {
    super(id ? id : nanoid());
  }
}
