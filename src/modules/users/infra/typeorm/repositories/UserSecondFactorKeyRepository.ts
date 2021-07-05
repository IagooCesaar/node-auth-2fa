import { getRepository, Repository } from "typeorm";

import { IUserSecondFactorKeyRepository } from "@modules/users/repositories/IUserSecondFactorKeyRepository";

import { UserSecondFactorKey } from "../entities/UserSecondFactorKey";

class UserSecondFactorKeyRepository implements IUserSecondFactorKeyRepository {
  private repository: Repository<UserSecondFactorKey>;
  constructor() {
    this.repository = getRepository(UserSecondFactorKey);
  }

  async generate(user_id: string): Promise<UserSecondFactorKey> {
    throw new Error("Method not implemented.");
  }
}

export { UserSecondFactorKeyRepository };
