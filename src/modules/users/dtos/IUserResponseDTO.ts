import { User } from "../infra/typeorm/entities/User";

type IUserResponseDTO = Omit<User, "password">;

export { IUserResponseDTO };
