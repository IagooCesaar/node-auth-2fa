import * as base32 from "hi-base32";
import { totp } from "otplib";

import { IOneTimePasswordProvider } from "../IOneTimePasswordProvider";

function loadOptions() {
  const data1 = new Date();
  const data2 = new Date(data1.valueOf() - data1.getTimezoneOffset() * 60000);
  const epoch = Math.floor(data2.valueOf() / 100);

  console.log("totp.options", data2.toISOString(), epoch);

  totp.resetOptions();
  totp.options = {
    digits: 6,
    step: 30,
    window: 5,
    epoch,
  };
}

class OTPLibProvider implements IOneTimePasswordProvider {
  verifyToken(token: string, secret: string) {
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
