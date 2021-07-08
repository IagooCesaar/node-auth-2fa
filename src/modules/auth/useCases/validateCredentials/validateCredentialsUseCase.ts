import { compare } from "bcryptjs";
import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import auth from "@config/auth";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { ICacheProvider } from "@shared/container/providers/CacheProvider/ICacheProvider";

import { ValidateCredentialsError } from "./validateCredentialsErrors";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  temporaryToken: string;
  expiresInMinutes: number;
}

@injectable()
class ValidateCredentialsUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new ValidateCredentialsError.UserNotFound();
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new ValidateCredentialsError.PasswordNotMatched();
    }

    const temporaryToken = uuidV4();

    await this.cacheProvider.set(
      auth.cache_temporary_token_prefix,
      temporaryToken,
      user.id,
      auth.cache_temporary_token_expiration_minutes * 60
    );

    return {
      temporaryToken,
      expiresInMinutes: auth.cache_temporary_token_expiration_minutes,
    };
  }
}

export { ValidateCredentialsUseCase };
