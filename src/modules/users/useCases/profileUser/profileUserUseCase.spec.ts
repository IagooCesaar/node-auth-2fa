import { v4 as uuidV4 } from "uuid";

import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";

import { CreateUserUseCase } from "../createUser/createUserUseCase";
import { ProfileUserError } from "./profileUserError";
import { ProfileUserUseCase } from "./profileUserUseCase";

let usersRepository: InMemoryUsersRepository;
let profileUserUseCase: ProfileUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Profile User Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    profileUserUseCase = new ProfileUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("Should be able to get a user profile", async () => {
    const { id: user_id } = await createUserUseCase.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "secret",
    });
    const user = await profileUserUseCase.execute(user_id);
    expect(user).toHaveProperty("id");
  });

  it("Should not be able to get a inexistent user profile", async () => {
    const user_id = uuidV4();
    await expect(profileUserUseCase.execute(user_id)).rejects.toBeInstanceOf(
      ProfileUserError.UserNotFound
    );
  });
});
