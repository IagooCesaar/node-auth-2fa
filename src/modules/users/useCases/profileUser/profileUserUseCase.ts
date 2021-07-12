import { inject, injectable } from "tsyringe";

import { IUserResponseDTO } from "@modules/users/dtos/IUserResponseDTO";
import { UserMap } from "@modules/users/mappers/UserMap";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

import { ProfileUserError } from "./profileUserError";

@injectable()
class ProfileUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(user_id: string): Promise<IUserResponseDTO> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new ProfileUserError.UserNotFound();
    }
    return UserMap.toDTO(user);
  }
}

export { ProfileUserUseCase };
