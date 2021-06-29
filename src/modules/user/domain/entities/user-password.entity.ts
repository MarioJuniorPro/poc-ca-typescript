import * as bcrypt from 'bcrypt';
import * as Joi from 'joi';
import { ValueObject } from '../../../../core/domain/value-object';
import { InvalidPasswordError } from '../errors/invalid-password.error';

interface UserPasswordProps {
  value: string;
  hashed?: boolean;
}

export class UserPassword extends ValueObject<UserPasswordProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserPasswordProps) {
    super(props);
  }

  static validate(password: string): boolean {
    const passwordSchema = Joi.string().min(6).max(12).alphanum();
    const validation = passwordSchema.validate(password);

    return !validation.error;
  }

  public static create(props: UserPasswordProps): UserPassword {
    // NOTE check how to check valid hashed values.
    if (!props.hashed && !UserPassword.validate(props.value)) {
      throw new InvalidPasswordError(props.value);
    }
    return new UserPassword({ value: props.value, hashed: props.hashed === true });
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    if (this.isAlreadyHashed()) {
      return bcrypt.compare(plainTextPassword, this.props.value);
    }
    return this.props.value === plainTextPassword;
  }

  public isAlreadyHashed(): boolean {
    return !!this.props.hashed;
  }

  public async getHashedValue(): Promise<string> {
    if (this.isAlreadyHashed()) {
      return this.props.value;
    }

    return await this.hashPassword(this.props.value);
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
