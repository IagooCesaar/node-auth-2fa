import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";

import { CreateUserError } from "./createUserError";
import { CreateUserUseCase } from "./createUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe("createUserUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      email: "test@example.com",
      name: "John Doe",
      password: "secret",
    });
    expect(user).toHaveProperty("id");
  });

  it("Should not be able to create a new user if email already in use", async () => {
    await createUserUseCase.execute({
      email: "test@example.com",
      name: "John Doe",
      password: "secret",
    });

    await expect(
      createUserUseCase.execute({
        email: "test@example.com",
        name: "Another John Doe",
        password: "secret to",
      })
    ).rejects.toBeInstanceOf(CreateUserError.EmailIsAlreadyInUse);
  });

  // it("", async () => {});
});
