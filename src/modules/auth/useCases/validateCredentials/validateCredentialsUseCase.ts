import { compare } from "bcryptjs";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

import { ValidateCredentialsError } from "./validateCredentialsErrors";

interface IRequest {
  email: string;
  password: string;
}

injectable();
class ValidateCredentialsUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ email, password }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new ValidateCredentialsError.UserNotFound();
    }
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new ValidateCredentialsError.PasswordNotMatched();
    }
  }
}

export { ValidateCredentialsUseCase };
