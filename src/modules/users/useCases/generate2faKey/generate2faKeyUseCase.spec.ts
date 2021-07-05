import { InMemoryUserSecondFactorKeyRepository } from "@modules/users/repositories/in-memory/InMemoryUserSecondFactorKeyRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";

import { Generate2faKeyUseCase } from "./generate2faKeyUseCase";

let generate2faKeyUseCase: Generate2faKeyUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let userSecondFactorKeyRepositoryInMemory: InMemoryUserSecondFactorKeyRepository;

describe("Generate2faKeyUseCase", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    userSecondFactorKeyRepositoryInMemory =
      new InMemoryUserSecondFactorKeyRepository();
    generate2faKeyUseCase = new Generate2faKeyUseCase(
      userSecondFactorKeyRepositoryInMemory,
      userRepositoryInMemory
    );
  });

  it("Should be able to generate a new key for a user", async () => {
    const user = await userRepositoryInMemory.create({
      email: "jhon.doe@example.com",
      name: "Jhon Doe",
      password: "secret",
    });
    const secondFactor = await generate2faKeyUseCase.execute(user.id);
    expect(secondFactor).toHaveProperty("key");
  });
  // it("Should be able to validate a key for a user", async () => {});

  // it("Should not be able to generate a key for a inexistent user", async () => {});
  // it("Should not be able to generate a key for a invalid user", async () => {});
  // it("Should not be able to validate a key with incorrect validation code", async () => {});
});
