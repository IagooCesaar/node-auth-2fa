import OTP from "otp";
import { injectable } from "tsyringe";

interface IRequest {
  user_id: string;
  totp_code: string;
}

@injectable()
class Validate2faKeyUseCase {
  async execute({ user_id, totp_code }: IRequest): Promise<string> {
    const otp = new OTP({
      secret:
        "N4MLKPIVFCEDVE7FT4DSHWG634PD6ZLMUFWKM3GKBRXRYH2ZJWANMUKWQTQKHJWG5WOOS36GRMDLDJBAOGNZOOS2TVY7GBKBAOJRSCIA",
    });
    const code = otp.totp(Date.now());
    return code;
  }
}

export { Validate2faKeyUseCase };
