interface IOneTimePasswordProvider {
  generateBase32Key(key: string): string;
  generateToken(secret: string): string;
  verifyToken(token: string, secret: string): boolean;
  generateKeyURI(accountName: string, issuer: string, secret: string): string;
}

export { IOneTimePasswordProvider };
