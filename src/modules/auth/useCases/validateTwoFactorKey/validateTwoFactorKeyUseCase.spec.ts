import "dotenv/config";

import { InMemoryUserTokensRepository } from "@modules/auth/repositories/in-memory/InMemoryUserTokensRepository";
import { InMemoryUserSecondFactorKeyRepository } from "@modules/users/repositories/in-memory/InMemoryUserSecondFactorKeyRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/createUserUseCase";
import { Generate2faKeyUseCase } from "@modules/users/useCases/generate2faKey/generate2faKeyUseCase";
import { Validate2faKeyUseCase } from "@modules/users/useCases/validate2fakey/validate2faKeyUseCase";
import { RedisCacheProvider } from "@shared/container/providers/CacheProvider/implementations/RedisCacheProvider";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayJsDateProvider";
import { OTPLibProvider } from "@shared/container/providers/OneTimePasswordProvider/implementations/OTPLibProvider";
import { LocalStorageProvider } from "@shared/container/providers/StorageProvider/implementations/LocalStorageProvider";

import { ValidateCredentialsUseCase } from "../validateCredentials/validateCredentialsUseCase";
import { ValidateTwoFactorKeyUseCase } from "./validateTwoFactorKeyUseCase";

let createUserUseCase: CreateUserUseCase;
let generate2faKeyUseCase: Generate2faKeyUseCase;
let validateCredentialsUseCase: ValidateCredentialsUseCase;
let validateTwoFactorKeyUseCase: ValidateTwoFactorKeyUseCase;
let validate2faKeyUseCase: Validate2faKeyUseCase;

let userSecondFactorKeyRepository: InMemoryUserSecondFactorKeyRepository;
let usersRepository: InMemoryUsersRepository;
let userTokensRepository: InMemoryUserTokensRepository;
let cacheProvider: RedisCacheProvider;
let storageProvider: LocalStorageProvider;
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
    storageProvider = new LocalStorageProvider();

    validateTwoFactorKeyUseCase = new ValidateTwoFactorKeyUseCase(
      userSecondFactorKeyRepository,
      usersRepository,
      userTokensRepository,
      cacheProvider,
      otp,
      dateProvider
    );

    validateCredentialsUseCase = new ValidateCredentialsUseCase(
      usersRepository,
      cacheProvider
    );

    createUserUseCase = new CreateUserUseCase(usersRepository);

    generate2faKeyUseCase = new Generate2faKeyUseCase(
      userSecondFactorKeyRepository,
      usersRepository,
      storageProvider,
      otp
    );

    validate2faKeyUseCase = new Validate2faKeyUseCase(
      userSecondFactorKeyRepository,
      otp
    );
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
