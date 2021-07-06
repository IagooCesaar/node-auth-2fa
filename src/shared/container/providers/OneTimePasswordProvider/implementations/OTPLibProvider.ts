import * as base32 from "hi-base32";
import { totp } from "otplib";

import { IOneTimePasswordProvider } from "../IOneTimePasswordProvider";

function loadOptions() {
  const now = Date.now();

  const date0 = new Date();
  const gmtMilliseconds = date0.getTimezoneOffset() * 60000;
  const regionDate = new Date(date0.valueOf() - gmtMilliseconds);
  const epoch = Math.floor(regionDate.getTime() / 1);

  console.log("totp.options", regionDate.toISOString(), epoch);

  totp.resetOptions();
  totp.options = {
    digits: 6,
    step: 30,
    window: 500,
    epoch,
  };
}

class OTPLibProvider implements IOneTimePasswordProvider {
  verifyToken(token: string, secret: string): boolean {
    loadOptions();
    return totp.verify({ token, secret });
  }

  generateToken(secret: string): string {
    loadOptions();
    const token = totp.generate(secret);
    return token;
  }

  generateBase32Key(key: string): string {
    loadOptions();
    return base32.encode(key);
  }
}

export { OTPLibProvider };
