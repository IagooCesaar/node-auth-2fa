import { container } from "tsyringe";
import "./providers";

import { UserTokensRepository } from "@modules/auth/infra/repositories/UserTokensRepository";
import { IUserTokensRepository } from "@modules/auth/repositories/IUserTokensRepository";
import { UserSecondFactorKeyRepository } from "@modules/users/infra/typeorm/repositories/UserSecondFactorKeyRepository";
import { UsersRepository } from "@modules/users/infra/typeorm/repositories/UsersRepository";
import { IUserSecondFactorKeyRepository } from "@modules/users/repositories/IUserSecondFactorKeyRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);

container.registerSingleton<IUserSecondFactorKeyRepository>(
  "UserSecondFactorKeyRepository",
  UserSecondFactorKeyRepository
);

container.registerSingleton<IUserTokensRepository>(
  "UserTokensRepository",
  UserTokensRepository
);
