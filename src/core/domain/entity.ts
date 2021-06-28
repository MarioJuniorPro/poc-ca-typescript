import { UniqueEntityId } from './unique-entity-id';

/**
 * Entity type guard.
 */
const isEntity = (v: any): v is Entity<any> => v instanceof Entity;

export abstract class Entity<T> {
  public readonly props: T;
  protected readonly _id: UniqueEntityId;

  constructor(props: T, id?: UniqueEntityId) {
    this._id = id ? id : new UniqueEntityId();
    this.props = props;
  }

  /**
   * Compare if the passed entity is equal.
   */
  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    // Compare if both share the same memory reference.
    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this._id.equals(object._id);
  }
}
