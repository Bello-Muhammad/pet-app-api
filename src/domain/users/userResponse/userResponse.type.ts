import { User } from '../schema/users.schema';

export type UserResponseType = Omit<User, 'password'> & { token: string };
