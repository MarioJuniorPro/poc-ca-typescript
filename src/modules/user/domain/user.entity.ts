import { Entity } from '../../../core/domain/entity';
import { UniqueEntityId } from '../../../core/domain/unique-entity-id';
import { UserEmail } from './user-email.entity';
import { UserId } from './user-id.entity';
import { UserPassword } from './user-password.entity';

interface UserProps {
  firstName: string;
  lastName: string;
  email: UserEmail;
  password: UserPassword;
}

export class User extends Entity<UserProps> {
  get id(): UniqueEntityId {
    return this._id;
  }

  get userId(): UserId {
    return UserId.create(this.id);
  }

  get email(): UserEmail {
    return this.props.email;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get password(): UserPassword {
    return this.props.password;
  }

  private constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: UserProps, id?: UniqueEntityId): User {
    return new User(props, id);
  }
}
