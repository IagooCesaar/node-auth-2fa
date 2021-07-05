import { UserSecondFactorKey } from "@modules/users/infra/typeorm/entities/UserSecondFactorKey";

import { IUserSecondFactorKeyRepository } from "../IUserSecondFactorKeyRepository";

class InMemoryUserSecondFactorKeyRepository
  implements IUserSecondFactorKeyRepository
{
  userSecondFactorKey: UserSecondFactorKey[] = [];

  async generate(user_id: string): Promise<UserSecondFactorKey> {
    throw new Error("Method not implemented.");
  }
}

export { InMemoryUserSecondFactorKeyRepository };
