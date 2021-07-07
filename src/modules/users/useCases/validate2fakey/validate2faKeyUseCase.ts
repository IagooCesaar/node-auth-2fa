import { inject, injectable } from "tsyringe";

import { IUserSecondFactorKeyRepository } from "@modules/users/repositories/IUserSecondFactorKeyRepository";
import { IOneTimePasswordProvider } from "@shared/container/providers/OneTimePasswordProvider/IOneTimePasswordProvider";

import { Validate2faKeyError } from "./validate2faKeyError";

interface IRequest {
  user_id: string;
  totp_code: string;
}

interface IResponse {
  isCorrect: boolean;
  message: string;
}

@injectable()
class Validate2faKeyUseCase {
  constructor(
    @inject("UserSecondFactorKeyRepository")
    private userSecondFactorKeyRepository: IUserSecondFactorKeyRepository,

    @inject("OneTimePasswordProvider")
    private otp: IOneTimePasswordProvider
  ) {}

  async execute({ user_id, totp_code }: IRequest): Promise<IResponse> {
    const userSecondFactorData =
      await this.userSecondFactorKeyRepository.findByUserId(user_id, false);
    if (!userSecondFactorData) {
      throw new Validate2faKeyError.NoKeysPendingValidation();
    }

    const { key } = userSecondFactorData;
    const isCorrect = this.otp.verifyToken(totp_code, key);
    if (!isCorrect) {
      return {
        isCorrect,
        message: "This code is not correct. Try again",
      };
    }

    // Remover chave validada e tornar esta chave como válida
    return {
      isCorrect,
      message:
        "All set up. This will be your new key for two-factor authentication",
    };
  }
}

export { Validate2faKeyUseCase };
