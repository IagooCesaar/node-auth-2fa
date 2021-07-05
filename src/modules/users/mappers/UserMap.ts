import { IUserResponseDTO } from "../dtos/IUserResponseDTO";
import { User } from "../infra/typeorm/entities/User";

class UserMap {
  static toDTO({ created_at, email, id, name }: User): IUserResponseDTO {
    const user = {
      created_at,
      email,
      id,
      name,
    };

    return user;
  }
}

export { UserMap };
