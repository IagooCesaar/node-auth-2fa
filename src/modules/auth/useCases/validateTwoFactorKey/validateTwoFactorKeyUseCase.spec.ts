import "dotenv/config";

import { InMemoryUserTokensRepository } from "@modules/auth/repositories/in-memory/InMemoryUserTokensRepository";
import { InMemoryUserSecondFactorKeyRepository } from "@modules/users/repositories/in-memory/InMemoryUserSecondFactorKeyRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/createUserUseCase";
import { RedisCacheProvider } from "@shared/container/providers/CacheProvider/implementations/RedisCacheProvider";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayJsDateProvider";
import { OTPLibProvider } from "@shared/container/providers/OneTimePasswordProvider/implementations/OTPLibProvider";

import { ValidateTwoFactorKeyUseCase } from "./validateTwoFactorKeyUseCase";

let createUserUseCase: CreateUserUseCase;
let validateTwoFactorKeyUseCase: ValidateTwoFactorKeyUseCase;
let userSecondFactorKeyRepository: InMemoryUserSecondFactorKeyRepository;
let usersRepository: InMemoryUsersRepository;
let userTokensRepository: InMemoryUserTokensRepository;
let cacheProvider: RedisCacheProvider;
let otp: OTPLibProvider;
let dateProvider: DayjsDateProvider;

describe("Validate Two Factor Key Use Case", () => {
  beforeEach(() => {
    userSecondFactorKeyRepository = new InMemoryUserSecondFactorKeyRepository();
    usersRepository = new InMemoryUsersRepository();
    userTokensRepository = new InMemoryUserTokensRepository();
    cacheProvider = new RedisCacheProvider();
    otp = new OTPLibProvider();
    dateProvider = new DayjsDateProvider();

    validateTwoFactorKeyUseCase = new ValidateTwoFactorKeyUseCase(
      userSecondFactorKeyRepository,
      usersRepository,
      userTokensRepository,
      cacheProvider,
      otp,
      dateProvider
    );

    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  afterEach(() => {
    cacheProvider.disconnect();
  });

  it("Should be able to validate a key and permit authentication", async () => {
    //
  });

  // it("Should not be able to validate a incorrect key", async () => {
  //   //
  // });

  // it("Should not be able to validate with a incorrect temporary login code", async () => {
  //   //
  // });
});
