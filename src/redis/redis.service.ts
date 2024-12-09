import { Inject, Injectable } from '@nestjs/common';
import * as redis from 'redis';

interface AuthMiddlewareHelperInterface {
  getAUserToken(userId: string, key: string): Promise<Object>
  hasValidUserToken(userId: string, key: string): Promise<boolean>
  get(key: string): Promise<String>
  hget(hash: string, key: string): Promise<String>
}

@Injectable()
export class RedisService implements AuthMiddlewareHelperInterface {
  private client;
  constructor(@Inject('REDIS_OPTIONS') private options) { }

  async onApplicationBootstrap() {
    if (!this.client) {
      await this.initialClient();
    }
  }

  async initialClient() {
    const { host, port, password } = this.options;
    return new Promise(async (resolve, reject) => {
      this.client = redis.createClient({
        url: `redis://${host}:${port}`,
        auth_pass: password,
        retry_strategy: () => 1000,
      });

      this.client.on('ready', async () => {
        console.log('KChannel connected to Auth Redis')
        resolve(this.client)
      })

      this.client.on('error', (err) => {
        console.warn('KChannel redis client error', err)
        reject()
      })
    })
  }

  async getClient() {
    await this.initialClient();

    if (!this.client) {
      console.log('Cannot access Redis client before connecting');
    }

    return this.client
  }

  onModuleDestroy() {
    this.client.quit()
  }

  async getAUserToken(userId: string, key: string): Promise<Object> {
    if (!this.client || !userId || !key)
      return null;

    // grouping hash
    const hash = userId;

    // Check expiration
    const combinedKey = `${hash}:${key}`;
    const cachingToken = await this.get(combinedKey);

    if (!cachingToken) {
      const existing = await this.hget(hash, key);
      if (existing) this.client.hdel(hash, key);
      return null
    };

    await this.hget(hash, key);
    return JSON.parse(cachingToken as string);
  }

  async hasValidUserToken(userId: string, key: string): Promise<boolean> {
    const existingToken = await this.getAUserToken(userId, key);
    return !!existingToken;
  }

  async get(key: string): Promise<String> {
    return new Promise((resolve, _) => {
      this.client.get(key, (err, val) => {
        return resolve(val);
      })
    });
  }

  async hget(hash: string, key: string): Promise<String> {
    return new Promise((resolve, _) => {
      this.client.hget(hash, key, (err, val) => {
        return resolve(val);
      })
    });
  }

  hgetAll(hash: string): Promise<object> {
    return new Promise((resolve, _) => {
      this.client.hgetall(hash, (_, object) => {
        return resolve(object);
      });
    })
  }

  hset(hash: string, key: string, val: string) {
    this.client.hset(hash, key, val);
  }

  set(key: string, val: string) {
    this.client.set(key, val);
  }

  expireAt(key: string, timestamps: number) {
    this.client.expireat(key, Math.ceil(timestamps))
  }

  setWithExpireAt(key: string, val: string, seconds: number) {
    this.client.set(key, val, 'EX', seconds);
  }

  delete(key: string) {
    this.client.del(key);
  }

  async hdel(hash: string, key: string) {
    return await this.client.hdel(hash, key);
  }
}
