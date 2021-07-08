import { ICreateUserTokenDTO } from "@modules/auth/dtos/ICreateUserTokenDTO";
import { UserTokens } from "@modules/auth/infra/typeorm/entities/UserTokens";

import { IUserTokensRepository } from "../IUserTokensRepository";

class InMemoryUserTokensRepository implements IUserTokensRepository {
  private UserTokens: UserTokens[] = [];

  async create(data: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = new UserTokens();
    Object.assign(userToken, data);
    this.UserTokens.push(userToken);
    return userToken;
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens> {
    return this.UserTokens.find(
      (userToken) =>
        userToken.user_id === user_id &&
        userToken.refresh_token === refresh_token
    );
  }

  async findByRefreshToken(token: string): Promise<UserTokens> {
    return this.UserTokens.find(
      (userToken) => userToken.refresh_token === token
    );
  }

  async deleteById(id: string): Promise<void> {
    const userTokenIndex = this.UserTokens.findIndex(
      (userToken) => userToken.id === id
    );
    this.UserTokens.splice(userTokenIndex, 1);
  }
}

export { InMemoryUserTokensRepository };
