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
import { ValidateTwoFactorKeyError } from "./validateTwoFactorKeyError";
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
    const response = await validateTwoFactorKeyUseCase.execute({
      temporaryToken,
      totp_code,
    });

    expect(response).toHaveProperty("token");
  });

  it("Should not be able to validate a incorrect temporary code", async () => {
    const userDTO = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "secret",
    };
    const { id: user_id } = await createUserUseCase.execute(userDTO);
    const { key } = await generate2faKeyUseCase.execute(user_id);
    let totp_code = otp.generateToken(key);

    await validate2faKeyUseCase.execute({
      user_id,
      totp_code,
    });

    await validateCredentialsUseCase.execute({
      email: userDTO.email,
      password: userDTO.password,
    });

    totp_code = otp.generateToken(key);
    await expect(
      validateTwoFactorKeyUseCase.execute({
        temporaryToken: "fake-token",
        totp_code,
      })
    ).rejects.toBeInstanceOf(ValidateTwoFactorKeyError.TemporaryTokenNotFound);
  });

  it("Should not be able to validate with a incorrect totp code", async () => {
    const userDTO = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "secret",
    };
    const { id: user_id } = await createUserUseCase.execute(userDTO);
    const { key } = await generate2faKeyUseCase.execute(user_id);
    const totp_code = otp.generateToken(key);

    await validate2faKeyUseCase.execute({
      user_id,
      totp_code,
    });

    const { temporaryToken } = await validateCredentialsUseCase.execute({
      email: userDTO.email,
      password: userDTO.password,
    });

    await expect(
      validateTwoFactorKeyUseCase.execute({
        temporaryToken,
        totp_code: "000000",
      })
    ).rejects.toBeInstanceOf(ValidateTwoFactorKeyError.IncorrectCode);
  });

  it("Should not be able to validate two-factor code with non-existent validated key", async () => {
    const userDTO = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "secret",
    };
    const { id: user_id } = await createUserUseCase.execute(userDTO);
    const { key } = await generate2faKeyUseCase.execute(user_id);

    const { temporaryToken } = await validateCredentialsUseCase.execute({
      email: userDTO.email,
      password: userDTO.password,
    });

    const totp_code = otp.generateToken(key);
    await expect(
      validateTwoFactorKeyUseCase.execute({
        temporaryToken,
        totp_code,
      })
    ).rejects.toBeInstanceOf(ValidateTwoFactorKeyError.NoValidKey);
  });
});
