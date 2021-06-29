import { Entity } from '@/core/domain/entity';
import { UniqueEntityId } from '@/core/domain/unique-entity-id';

export class UserId extends Entity<any> {
  get id(): UniqueEntityId {
    return this._id;
  }

  private constructor(id?: UniqueEntityId) {
    super(null, id);
  }

  public static create(id?: UniqueEntityId): UserId {
    return new UserId(id);
  }
}
