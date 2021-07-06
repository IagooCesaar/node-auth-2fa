interface IOneTimePasswordProvider {
  generateBase32Key(key: string): string;
  generateToken(secret: string): string;
}

export { IOneTimePasswordProvider };
