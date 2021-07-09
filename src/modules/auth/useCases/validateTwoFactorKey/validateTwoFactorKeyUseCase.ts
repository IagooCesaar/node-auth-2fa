import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUserTokensRepository } from "@modules/auth/repositories/IUserTokensRepository";
import { IUserSecondFactorKeyRepository } from "@modules/users/repositories/IUserSecondFactorKeyRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { ICacheProvider } from "@shared/container/providers/CacheProvider/ICacheProvider";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IOneTimePasswordProvider } from "@shared/container/providers/OneTimePasswordProvider/IOneTimePasswordProvider";

import { ValidateTwoFactorKeyError } from "./validateTwoFactorKeyError";

interface IRequest {
  totp_code: string;
  temporaryToken: string;
}

interface IResponse {
  token: string;
  refreshToken: string;
  user: {
    name: string;
    email: string;
  };
}

@injectable()
class ValidateTwoFactorKeyUseCase {
  constructor(
    @inject("UserSecondFactorKeyRepository")
    private userSecondFactorKeyRepository: IUserSecondFactorKeyRepository,

    @inject("UsersRepository")
    private userRepository: IUsersRepository,

    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,

    @inject("CacheProvider")
    private cacheProvider: ICacheProvider,

    @inject("OneTimePasswordProvider")
    private otp: IOneTimePasswordProvider,

    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ temporaryToken, totp_code }: IRequest): Promise<IResponse> {
    // validar token temporario
    const user_id = await this.cacheProvider.get(
      auth.cache_temporary_token_prefix,
      temporaryToken
    );
    if (!user_id) {
      throw new ValidateTwoFactorKeyError.TemporaryTokenNotFound();
    }

    // buscar dados topt
    const userSecondFactorData =
      await this.userSecondFactorKeyRepository.findByUserId(user_id, true);
    if (!userSecondFactorData) {
      throw new ValidateTwoFactorKeyError.NoValidKey();
    }
    const { key } = userSecondFactorData;

    // validar topt
    const isCorrect = this.otp.verifyToken(totp_code, key);
    if (!isCorrect) {
      throw new ValidateTwoFactorKeyError.IncorrectCode();
    }

    const user = await this.userRepository.findById(user_id);

    // gerar token
    const token = sign({}, auth.secret_token, {
      subject: user.id,
      expiresIn: auth.expires_in,
    });

    // gerar refresh token
    const refreshToken = sign(
      { email: user.email },
      auth.secret_refresh_token,
      {
        subject: user.id,
        expiresIn: auth.expires_in_refresh_token,
      }
    );

    // armazenar refresh token
    const refresh_token_expires_date = this.dateProvider.addDays(
      auth.expires_refresh_token_days,
      null
    );
    await this.userTokensRepository.create({
      user_id,
      refresh_token: refreshToken,
      expires_date: refresh_token_expires_date,
    });

    return {
      token,
      refreshToken,
      user: {
        email: user.email,
        name: user.name,
      },
    };
  }
}

export { ValidateTwoFactorKeyUseCase };
