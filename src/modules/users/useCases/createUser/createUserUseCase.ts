import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

import { IUserResponseDTO } from "@modules/users/dtos/IUserResponseDTO";
import { UserMap } from "@modules/users/mappers/UserMap";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) { }

  async execute({
    email,
    name,
    password,
  }: IRequest): Promise<IUserResponseDTO> {
    const hashedPassword = hash(
      password,
      Number(process.env.DEFAULT_HASH_SAULT)
    );

    const user = await this.usersRepository.create({
      email,
      name,
      password: hashedPassword,
    });
    return UserMap.toDTO(user);
  }
}

export { CreateUserUseCase };
