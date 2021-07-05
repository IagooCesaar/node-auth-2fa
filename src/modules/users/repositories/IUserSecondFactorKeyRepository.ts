import { UserSecondFactorKey } from "../infra/typeorm/entities/UserSecondFactorKey";

interface IUserSecondFactorKeyRepository {
  generate(user_id: string): Promise<UserSecondFactorKey>;
}

export { IUserSecondFactorKeyRepository };
