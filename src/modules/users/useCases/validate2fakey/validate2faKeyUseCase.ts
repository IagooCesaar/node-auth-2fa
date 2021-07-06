import OTP from "otp";
import { inject, injectable } from "tsyringe";

import { IUserSecondFactorKeyRepository } from "@modules/users/repositories/IUserSecondFactorKeyRepository";

interface IRequest {
  user_id: string;
  totp_code: string;
}

@injectable()
class Validate2faKeyUseCase {
  constructor(
    @inject("UserSecondFactorKeyRepository")
    private userSecondFactorKeyRepository: IUserSecondFactorKeyRepository
  ) {}

  async execute({
    user_id,
    totp_code,
  }: IRequest): Promise<{ code: string; now: number }> {
    const { key } = await this.userSecondFactorKeyRepository.findByUserId(
      user_id,
      false
    );
    const otp = new OTP({
      secret: key,
    });
    const now = Date.now();
    const code = otp.totp(now);
    return { code, now };
  }
}

export { Validate2faKeyUseCase };
