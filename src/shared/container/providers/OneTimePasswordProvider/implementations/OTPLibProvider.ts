import { authenticator } from "otplib";

import { IOneTimePasswordProvider } from "../IOneTimePasswordProvider";

function loadOptions() {
  authenticator.resetOptions();
  authenticator.options = {
    ...authenticator.options,
    digits: 6,
    step: 30,
    window: 5,
    epoch: Date.now(),
  };
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

  generateBase32Key(): string {
    loadOptions();
    return authenticator.generateSecret();
  }
}

export { OTPLibProvider };
