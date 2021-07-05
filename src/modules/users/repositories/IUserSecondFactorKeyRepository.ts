import { UserSecondFactorKey } from "../infra/typeorm/entities/UserSecondFactorKey";

interface IUserSecondFactorKeyRepository {
  generate(user_id: string, key: string): Promise<UserSecondFactorKey>;
  removeUnvalidatedKeys(user_id: string): Promise<void>;
}

export { IUserSecondFactorKeyRepository };
