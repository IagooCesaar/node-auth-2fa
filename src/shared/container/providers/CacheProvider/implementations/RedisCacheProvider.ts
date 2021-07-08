import Redis from "ioredis";

import { ICacheProvider } from "../ICacheProvider";

class RedisCacheProvider implements ICacheProvider {
  client: Redis.Redis = null;

  constructor() {
    this.client = this.connect();
  }

  connect(): Redis.Redis {
    const connection = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });
    // connection.on("connect", () => {
    //   console.log("redis connected");
    // });
    // connection.on("error", (err) => {
    //   console.log("redis error", err);
    // });
    return connection;
  }

  disconnect(): void {
    this.client.disconnect();
  }

  async get(prefix: string, key: string): Promise<string> {
    const value = await this.client.get(`${prefix}:${key}`);
    return value;
  }

  async set(
    prefix: string,
    key: string,
    value: string,
    expirationInSeconds = 0
  ): Promise<void> {
    if (expirationInSeconds === 0) {
      await this.client.set(`${prefix}:${key}`, value);
    } else {
      await this.client.set(
        `${prefix}:${key}`,
        value,
        "EX",
        expirationInSeconds
      );
    }
  }

  async delete(prefix: string, key: string): Promise<void> {
    await this.client.del(`${prefix}:${key}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getClientConnection(): any {
    return this.client;
  }
}

export { RedisCacheProvider };
