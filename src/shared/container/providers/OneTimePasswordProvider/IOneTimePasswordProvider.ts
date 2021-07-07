interface IOneTimePasswordProvider {
  generateBase32Key(): string;
  generateToken(secret: string): string;
  verifyToken(token: string, secret: string): boolean;
  generateKeyURI(accountName: string, issuer: string, secret: string): string;
}

export { IOneTimePasswordProvider };
