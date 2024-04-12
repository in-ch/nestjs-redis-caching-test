import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';

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
  constructor() {}

  @UseInterceptors(CacheInterceptor) // 이거 추가
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
}
