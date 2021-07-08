import { getRepository, Repository } from "typeorm";

import { ICreateUserTokenDTO } from "@modules/auth/dtos/ICreateUserTokenDTO";
import { IUserTokensRepository } from "@modules/auth/repositories/IUserTokensRepository";

import { UserTokens } from "../typeorm/entities/UserTokens";

class UserTokensRepository implements IUserTokensRepository {
  private repository: Repository<UserTokens>;
  constructor() {
    this.repository = getRepository(UserTokens);
  }

  async create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = this.repository.create({
      user_id,
      expires_date,
      refresh_token,
    });
    await this.repository.save(userToken);
    return userToken;
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens> {
    const userToken = await this.repository.findOne({
      user_id,
      refresh_token,
    });
    return userToken;
  }

  async findByRefreshToken(token: string): Promise<UserTokens> {
    const userToken = await this.repository.findOne({
      refresh_token: token,
    });
    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { UserTokensRepository };
