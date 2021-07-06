interface IOneTimePasswordProvider {
  generateBase32Key(key: string): string;
  generateToken(secret: string): string;
  verifyToken(token: string, secret: string);
}

export { IOneTimePasswordProvider };
