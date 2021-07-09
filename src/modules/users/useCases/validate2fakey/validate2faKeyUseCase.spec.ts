import { InMemoryUserSecondFactorKeyRepository } from "@modules/users/repositories/in-memory/InMemoryUserSecondFactorKeyRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { OTPLibProvider } from "@shared/container/providers/OneTimePasswordProvider/implementations/OTPLibProvider";
import { LocalStorageProvider } from "@shared/container/providers/StorageProvider/implementations/LocalStorageProvider";

import { Generate2faKeyUseCase } from "../generate2faKey/generate2faKeyUseCase";
import { Validate2faKeyError } from "./validate2faKeyError";
import { Validate2faKeyUseCase } from "./validate2faKeyUseCase";

let validate2faKeyUseCase: Validate2faKeyUseCase;
let generate2faKeyUseCase: Generate2faKeyUseCase;
let usersSecondFactorKeyRepository: InMemoryUserSecondFactorKeyRepository;
let usersRepository: InMemoryUsersRepository;
let storageProvider: LocalStorageProvider;
let otp: OTPLibProvider;

describe("validate2faKeyUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    usersSecondFactorKeyRepository =
      new InMemoryUserSecondFactorKeyRepository();
    otp = new OTPLibProvider();
    storageProvider = new LocalStorageProvider();

    validate2faKeyUseCase = new Validate2faKeyUseCase(
      usersSecondFactorKeyRepository,
      otp
    );
    generate2faKeyUseCase = new Generate2faKeyUseCase(
      usersSecondFactorKeyRepository,
      usersRepository,
      storageProvider,
      otp
    );
  });

  it("Should be able to validate a new Key for a user", async () => {
    const { id: user_id } = await usersRepository.create({
      email: "john.doe@example.com",
      name: "John Doe",
      password: "secret",
    });

    await generate2faKeyUseCase.execute(user_id);
    const { key } = await usersSecondFactorKeyRepository.findByUserId(
      user_id,
      false
    );

    const totp_code = otp.generateToken(key);

    const response = await validate2faKeyUseCase.execute({
      user_id,
      totp_code,
    });
    expect(response.isCorrect).toBe(true);
  });

  it("Should not be able to validate Key with invalide code", async () => {
    const { id: user_id } = await usersRepository.create({
      email: "john.doe@example.com",
      name: "John Doe",
      password: "secret",
    });

    await generate2faKeyUseCase.execute(user_id);
    const totp_code = "000000";

    await expect(
      validate2faKeyUseCase.execute({
        user_id,
        totp_code,
      })
    ).rejects.toBeInstanceOf(Validate2faKeyError.IncorrectCode);
  });

  it("Should not be able to validate with inexistent Key", async () => {
    const { id: user_id } = await usersRepository.create({
      email: "john.doe@example.com",
      name: "John Doe",
      password: "secret",
    });

    const totp_code = "000000";
    await expect(
      validate2faKeyUseCase.execute({
        user_id,
        totp_code,
      })
    ).rejects.toBeInstanceOf(Validate2faKeyError.NoKeysPendingValidation);
  });
});
