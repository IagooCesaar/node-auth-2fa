import * as base32 from "hi-base32";
import { totp } from "otplib";

import { IOneTimePasswordProvider } from "../IOneTimePasswordProvider";

class OTPLibProvider implements IOneTimePasswordProvider {
  generateToken(secret: string): string {
    const token = totp.generate(secret);
    return token;
  }

  generateBase32Key(key: string): string {
    return base32.encode(key);
  }
}

export { OTPLibProvider };
