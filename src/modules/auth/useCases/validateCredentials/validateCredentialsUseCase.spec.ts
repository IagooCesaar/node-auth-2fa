import "dotenv/config";

import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/createUserUseCase";
import { RedisCacheProvider } from "@shared/container/providers/CacheProvider/implementations/RedisCacheProvider";

import { ValidateCredentialsError } from "./validateCredentialsErrors";
import { ValidateCredentialsUseCase } from "./validateCredentialsUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let validateCredentialsUseCase: ValidateCredentialsUseCase;
let cacheProvider: RedisCacheProvider;

describe("Validate Credentials Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    cacheProvider = new RedisCacheProvider();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    validateCredentialsUseCase = new ValidateCredentialsUseCase(
      usersRepository,
      cacheProvider
    );
  });

  afterEach(() => {
    cacheProvider.disconnect();
  });

  it("Should be able to validate a user's email and password", async () => {
    await createUserUseCase.execute({
      email: "john.doe@example.com",
      name: "John Doe",
      password: "secret",
    });

    const response = await validateCredentialsUseCase.execute({
      email: "john.doe@example.com",
      password: "secret",
    });

    expect(response).toHaveProperty("temporaryToken");
  });

  it("Should not be able to validate with inexistent email", async () => {
    await expect(
      validateCredentialsUseCase.execute({
        email: "john.doe@example.com",
        password: "secret",
      })
    ).rejects.toBeInstanceOf(ValidateCredentialsError.UserNotFound);
  });

  it("Should not be able to validate a incorrect password", async () => {
    await createUserUseCase.execute({
      email: "john.doe@example.com",
      name: "John Doe",
      password: "secret",
    });

    await expect(
      validateCredentialsUseCase.execute({
        email: "john.doe@example.com",
        password: "no-secret",
      })
    ).rejects.toBeInstanceOf(ValidateCredentialsError.PasswordNotMatched);
  });
});
