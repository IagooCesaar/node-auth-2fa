interface ICacheProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getClientConnection(): any;
  disconnect(): void;
  get(prefix: string, key: string): Promise<string>;
  set(
    prefix: string,
    key: string,
    value: string,
    expirationInSeconds: number
  ): Promise<void>;
  delete(prefix: string, key: string): Promise<void>;
}

export { ICacheProvider };
