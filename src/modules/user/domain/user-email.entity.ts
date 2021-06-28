import * as Joi from 'joi';
import { ValueObject } from '../../../core/domain/ValueObject';
import { InvalidEmailError } from './errors/invalid-email.error';

interface UserEmailProps {
  value: string;
}

export class UserEmail extends ValueObject<UserEmailProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserEmailProps) {
    super(props);
  }

  public static create(email: string): UserEmail {
    if (!UserEmail.validate(email)) {
      throw new InvalidEmailError(email);
    }
    return new UserEmail({ value: email });
  }

  static validate(email: string): boolean {
    const emailSchema = Joi.string().email();
    const validation = emailSchema.validate(email);

    return !validation.error;
  }
}
