import "dotenv/config";

import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/createUserUseCase";
import { RedisCacheProvider } from "@shared/container/providers/CacheProvider/implementations/RedisCacheProvider";

describe("Validate Two Factor Key Use Case", () => {
  it("Should be able to validate a key and permit authentication", () => {
    //
  });

  it("Should not be able to validate a incorrect key", () => {
    //
  });

  it("Should not be able to validate with a incorrect temporary login code", () => {
    //
  });
});
