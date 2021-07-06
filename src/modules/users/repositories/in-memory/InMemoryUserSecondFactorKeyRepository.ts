import { UserSecondFactorKey } from "@modules/users/infra/typeorm/entities/UserSecondFactorKey";

import { IUserSecondFactorKeyRepository } from "../IUserSecondFactorKeyRepository";

class InMemoryUserSecondFactorKeyRepository
  implements IUserSecondFactorKeyRepository
{
  userSecondFactorKey: UserSecondFactorKey[] = [];

  async findByUserId(
    user_id: string,
    validated: boolean
  ): Promise<UserSecondFactorKey> {
    return this.userSecondFactorKey.find((user) => {
      return user.user_id === user_id && user.validated === validated;
    });
  }

  async removeUnvalidatedKeys(user_id: string): Promise<void> {
    const keys = this.userSecondFactorKey.filter((item) => {
      return (
        item.user_id !== user_id || (item.user_id === user_id && item.validated)
      );
    });
    this.userSecondFactorKey = [...keys];
  }

  async generate(user_id: string, key: string): Promise<UserSecondFactorKey> {
    const secondFactor = new UserSecondFactorKey();
    Object.assign(secondFactor, {
      key,
      user_id,
      validated: false,
    } as UserSecondFactorKey);
    await this.userSecondFactorKey.push(secondFactor);
    return secondFactor;
  }
}

export { InMemoryUserSecondFactorKeyRepository };
