import { Injectable } from '@nestjs/common';

@Injectable()
export class AppHelperService {
  constructor() {}

  createRandomCodeNumber(length: number) {
    return Math.floor(100000 + Math.random() * 900000)
      .toString()
      .slice(0, length);
  }

  trimAllSpaces(str: string) {
    return str.replace(/\s/g, '');
  }
}
