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
    // verificar se usuário existe
    // deletar chaves não validadas
    // gerar uma nova chave
  }
}

export { Generate2faKeyUseCase };
