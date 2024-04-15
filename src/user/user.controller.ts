import {
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  CACHE_MANAGER,
} from '@nestjs/cache-manager';
import { Controller, Get, Inject, UseInterceptors } from '@nestjs/common';
import { Cache } from 'cache-manager';

function generateRandomName() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let name = '';
  for (let i = 0; i < 4; i++) {
    name += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return name;
}

function generateRandomEmail(name) {
  const domains = ['example.com', 'test.com', 'mail.com', 'company.com'];
  const randomNumber = Math.floor(Math.random() * 1000);
  return `${name}${randomNumber}@${domains[Math.floor(Math.random() * domains.length)]}`;
}

@Controller('user')
export class UserController {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  @UseInterceptors(CacheInterceptor) // 이거 추가
  @CacheTTL(10000)
  @CacheKey('user')
  @Get()
  getUser() {
    const data = [];

    for (let i = 0; i <= 100000; i++) {
      const name = generateRandomName();
      const email = generateRandomEmail(name);
      data.push({ id: i, email, name });
    }

    return new Promise((resolve, _) => {
      setTimeout(() => {
        resolve(data);
      }, 2000);
    });
  }

  @Get('/man')
  async getMans() {
    const cachedData = await this.cacheManager.get('man');
    if (cachedData)
      return {
        currentTime: new Date().toString(),
      };
    const data = [];

    for (let i = 0; i <= 100; i++) {
      const name = generateRandomName();
      const email = generateRandomEmail(name);
      data.push({ id: i, email, name });
    }

    this.cacheManager.set('man', data);

    return new Promise((resolve, _) => {
      setTimeout(() => {
        resolve({
          currentTime: new Date().toString(),
          data,
        });
      }, 2000);
    });
  }
}
