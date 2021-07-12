import "dotenv/config";

import { InMemoryUserTokensRepository } from "@modules/auth/repositories/in-memory/InMemoryUserTokensRepository";
import { UserSecondFactorKey } from "@modules/users/infra/typeorm/entities/UserSecondFactorKey";
import { InMemoryUserSecondFactorKeyRepository } from "@modules/users/repositories/in-memory/InMemoryUserSecondFactorKeyRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/createUserUseCase";
import { Generate2faKeyUseCase } from "@modules/users/useCases/generate2faKey/generate2faKeyUseCase";
import { Validate2faKeyUseCase } from "@modules/users/useCases/validate2fakey/validate2faKeyUseCase";
import { RedisCacheProvider } from "@shared/container/providers/CacheProvider/implementations/RedisCacheProvider";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayJsDateProvider";
import { OTPLibProvider } from "@shared/container/providers/OneTimePasswordProvider/implementations/OTPLibProvider";
import { LocalStorageProvider } from "@shared/container/providers/StorageProvider/implementations/LocalStorageProvider";

import { ValidateCredentialsUseCase } from "../validateCredentials/validateCredentialsUseCase";
import { ValidateTwoFactorKeyUseCase } from "../validateTwoFactorKey/validateTwoFactorKeyUseCase";
import { RefreshTokenUseCase } from "./refreshTokenUseCase";

let userTokensRepository: InMemoryUserTokensRepository;
let usersRepository: InMemoryUsersRepository;
let userSecondFactorKeyRepository: InMemoryUserSecondFactorKeyRepository;
let dateProvider: IDateProvider;
let storageProvider: LocalStorageProvider;
let otp: OTPLibProvider;
let cacheProvider: RedisCacheProvider;

let refreshTokenUseCase: RefreshTokenUseCase;
let createUserUseCase: CreateUserUseCase;
let validate2faKeyUseCase: Validate2faKeyUseCase;
let generate2faKeyUseCase: Generate2faKeyUseCase;
let validateCredentialsUseCase: ValidateCredentialsUseCase;
let validateTwoFactorKeyUseCase: ValidateTwoFactorKeyUseCase;

describe("Refresh Token Use Case", () => {
  beforeEach(() => {
    cacheProvider = new RedisCacheProvider();
    dateProvider = new DayjsDateProvider();
    otp = new OTPLibProvider();
    storageProvider = new LocalStorageProvider();

    userTokensRepository = new InMemoryUserTokensRepository();
    usersRepository = new InMemoryUsersRepository();
    userSecondFactorKeyRepository = new InMemoryUserSecondFactorKeyRepository();
    userSecondFactorKeyRepository = new InMemoryUserSecondFactorKeyRepository();

    refreshTokenUseCase = new RefreshTokenUseCase(
      userTokensRepository,
      dateProvider
    );

    createUserUseCase = new CreateUserUseCase(usersRepository);

    validate2faKeyUseCase = new Validate2faKeyUseCase(
      userSecondFactorKeyRepository,
      otp
    );
    generate2faKeyUseCase = new Generate2faKeyUseCase(
      userSecondFactorKeyRepository,
      usersRepository,
      storageProvider,
      otp
    );

    validateCredentialsUseCase = new ValidateCredentialsUseCase(
      usersRepository,
      cacheProvider
    );

    validateTwoFactorKeyUseCase = new ValidateTwoFactorKeyUseCase(
      userSecondFactorKeyRepository,
      usersRepository,
      userTokensRepository,
      cacheProvider,
      otp,
      dateProvider
    );
  });

  afterEach(() => {
    cacheProvider.disconnect();
  });

  it("Should be able do generate a new token and refresh token", async () => {
    // criar usuário
    const userDTO = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "secret",
    };
    const { id: user_id } = await createUserUseCase.execute(userDTO);

    await generate2faKeyUseCase.execute(user_id);
    const { key } = await userSecondFactorKeyRepository.findByUserId(
      user_id,
      false
    );

    let totp_code = otp.generateToken(key);
    await validate2faKeyUseCase.execute({
      user_id,
      totp_code,
    });

    const { temporaryToken } = await validateCredentialsUseCase.execute({
      email: userDTO.email,
      password: userDTO.password,
    });

    totp_code = otp.generateToken(key);
    const { refreshToken } = await validateTwoFactorKeyUseCase.execute({
      temporaryToken,
      totp_code,
    });

    const response = await refreshTokenUseCase.execute(refreshToken);

    expect(response).toHaveProperty("token");
    expect(response).toHaveProperty("refreshToken");
  });
});
