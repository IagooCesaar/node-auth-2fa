import { inject, injectable } from "tsyringe";

import { IUserSecondFactorKeyRepository } from "@modules/users/repositories/IUserSecondFactorKeyRepository";
import { IOneTimePasswordProvider } from "@shared/container/providers/OneTimePasswordProvider/IOneTimePasswordProvider";

interface IRequest {
  user_id: string;
  totp_code: string;
}

@injectable()
class Validate2faKeyUseCase {
  constructor(
    @inject("UserSecondFactorKeyRepository")
    private userSecondFactorKeyRepository: IUserSecondFactorKeyRepository,

    @inject("OneTimePasswordProvider")
    private otp: IOneTimePasswordProvider
  ) {}

  async execute({
    user_id,
    totp_code,
  }: IRequest): Promise<{ code: string; key: string; valid: boolean }> {
    const { key } = await this.userSecondFactorKeyRepository.findByUserId(
      user_id,
      false
    );

    const code = this.otp.generateToken(key);
    const valid = this.otp.verifyToken(totp_code, key);
    return { code, valid, key };
  }
}

export { Validate2faKeyUseCase };
