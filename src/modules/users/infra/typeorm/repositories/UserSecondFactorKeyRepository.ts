import { getRepository, Repository } from "typeorm";

import { IUserSecondFactorKeyRepository } from "@modules/users/repositories/IUserSecondFactorKeyRepository";

import { UserSecondFactorKey } from "../entities/UserSecondFactorKey";

class UserSecondFactorKeyRepository implements IUserSecondFactorKeyRepository {
  private repository: Repository<UserSecondFactorKey>;
  constructor() {
    this.repository = getRepository(UserSecondFactorKey);
  }

  async removeUnvalidatedKeys(user_id: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .where("user_id = :user_id and validated = :validated", {
        user_id,
        validated: false,
      })
      .execute();
  }

  async generate(user_id: string, key: string): Promise<UserSecondFactorKey> {
    const secondFactor = this.repository.create({
      key,
      user_id,
      validated: false,
    });
    await this.repository.save(secondFactor);
    return secondFactor;
  }
}

export { UserSecondFactorKeyRepository };
