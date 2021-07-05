import { inject, injectable } from "tsyringe";

import { UserSecondFactorKey } from "@modules/users/infra/typeorm/entities/UserSecondFactorKey";
import { IUserSecondFactorKeyRepository } from "@modules/users/repositories/IUserSecondFactorKeyRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

import { Generate2faKeyError } from "./generate2faKeyError";

@injectable()
class Generate2faKeyUseCase {
  constructor(
    @inject("UserSecondFactorKeyRepository")
    private userSecondFactorKeyRepository: IUserSecondFactorKeyRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(user_id: string): Promise<UserSecondFactorKey> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new Generate2faKeyError.UserNotFound();
    }
    // deletar chaves não validadas
    // gerar uma nova chave
  }
}

export { Generate2faKeyUseCase };
