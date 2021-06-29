import { UseCase } from '@/core/domain/usecase';

export interface AddUserParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type AddUserResult = boolean;

export type AddUserUseCase = UseCase<AddUserParams, AddUserResult>;
