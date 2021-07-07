import { InMemoryUserSecondFactorKeyRepository } from "@modules/users/repositories/in-memory/InMemoryUserSecondFactorKeyRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { OTPLibProvider } from "@shared/container/providers/OneTimePasswordProvider/implementations/OTPLibProvider";
import { LocalStorageProvider } from "@shared/container/providers/StorageProvider/implementations/LocalStorageProvider";

import { Generate2faKeyError } from "./generate2faKeyError";
import { Generate2faKeyUseCase } from "./generate2faKeyUseCase";

let generate2faKeyUseCase: Generate2faKeyUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let storageProvider: LocalStorageProvider;
let otp: OTPLibProvider;
let userSecondFactorKeyRepositoryInMemory: InMemoryUserSecondFactorKeyRepository;

describe("Generate2faKeyUseCase", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    storageProvider = new LocalStorageProvider();
    otp = new OTPLibProvider();
    userSecondFactorKeyRepositoryInMemory =
      new InMemoryUserSecondFactorKeyRepository();
    generate2faKeyUseCase = new Generate2faKeyUseCase(
      userSecondFactorKeyRepositoryInMemory,
      userRepositoryInMemory,
      storageProvider,
      otp
    );
  });

  it("Should be able to generate key for a user", async () => {
    const user = await userRepositoryInMemory.create({
      email: "jhon.doe@example.com",
      name: "Jhon Doe",
      password: "secret",
    });
    const secondFactor = await generate2faKeyUseCase.execute(user.id);
    expect(secondFactor).toHaveProperty("key");
    expect(secondFactor).toHaveProperty("qrcode_url");
  });

  it("Should be able to generate a different key for a user", async () => {
    const user = await userRepositoryInMemory.create({
      email: "jhon.doe@example.com",
      name: "Jhon Doe",
      password: "secret",
    });
    const secondFactor1 = await generate2faKeyUseCase.execute(user.id);
    expect(secondFactor1).toHaveProperty("key");

    const secondFactor2 = await generate2faKeyUseCase.execute(user.id);
    expect(secondFactor2).toHaveProperty("key");

    expect(secondFactor1.key).not.toBe(secondFactor2.key);
  });

  it("Should not be able to generate a key for a inexistent user", async () => {
    const user_id = "fake_id";
    await expect(generate2faKeyUseCase.execute(user_id)).rejects.toBeInstanceOf(
      Generate2faKeyError.UserNotFound
    );
  });
});
