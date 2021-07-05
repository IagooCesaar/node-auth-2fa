import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

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
    await this.userSecondFactorKeyRepository.removeUnvalidatedKeys(user_id);
    // gerar uma nova chave
    const key = uuidV4();
    const new2fa = await this.userSecondFactorKeyRepository.generate(
      user_id,
      key
    );
    return new2fa;
  }
}

export { Generate2faKeyUseCase };
