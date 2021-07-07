import crypto from "crypto";
import * as base32 from "hi-base32";
import { authenticator } from "otplib";

import { IOneTimePasswordProvider } from "../IOneTimePasswordProvider";

function loadOptions() {
  const date0 = new Date();
  const gmtMilliseconds = date0.getTimezoneOffset() * 60000;
  const regionDate = new Date(date0.valueOf() - gmtMilliseconds);
  const epoch = Math.floor(regionDate.getTime() / 1);

  authenticator.resetOptions();
  authenticator.options = {
    ...authenticator.options,
    digits: 6,
    step: 30,
    window: 5,
    // epoch: Date.now(),
    epoch,
  };
  console.log(authenticator.options, regionDate.toISOString());
}

class OTPLibProvider implements IOneTimePasswordProvider {
  generateKeyURI(accountName: string, issuer: string, secret: string): string {
    return authenticator.keyuri(accountName, issuer, secret);
  }

  verifyToken(token: string, secret: string): boolean {
    loadOptions();
    return authenticator.verify({ token, secret });
  }

  generateToken(secret: string): string {
    loadOptions();
    const token = authenticator.generate(secret);

    return token;
  }

  generateBase32Key(key: string): string {
    loadOptions();
    return authenticator.encode(key);
    // return crypto.randomBytes(32).toString("hex").substr(0, 20);
    // return base32.encode(key);
  }
}

export { OTPLibProvider };
