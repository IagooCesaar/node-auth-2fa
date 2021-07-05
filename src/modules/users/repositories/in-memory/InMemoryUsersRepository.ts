import { ICreateUserDTO } from "@modules/users/dtos/ICreateUserDTO";
import { User } from "@modules/users/infra/typeorm/entities/User";

import { IUsersRepository } from "../IUsersRepository";

class InMemoryUsersRepository implements IUsersRepository {
  users: User[] = [];

  async findByEmail(email: string): Promise<User> {
    return this.users.find((user) => user.email === email);
  }

  async findById(id: string): Promise<User> {
    return this.users.find((user) => user.id === id);
  }

  async create({ email, name, password }: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { email, name, password });
    this.users.push(user);
    return user;
  }
}

export { InMemoryUsersRepository };
