import { inject, injectable } from "tsyringe";

import { UserSecondFactorKey } from "@modules/users/infra/typeorm/entities/UserSecondFactorKey";
import { IUserSecondFactorKeyRepository } from "@modules/users/repositories/IUserSecondFactorKeyRepository";

@injectable()
class Generate2faKeyUseCase {
  constructor(
    @inject("UserSecondFactorKeyRepository")
    private userSecondFactorKeyRepository: IUserSecondFactorKeyRepository
  ) {}

  async execute(user_id: string): Promise<UserSecondFactorKey> {
    //
  }
}

export { Generate2faKeyUseCase };
