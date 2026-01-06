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

  isValidSequence(values: number[]): boolean {
    const length = values.length;
    const set = new Set<number>();

    for (const value of values) {
      if (!Number.isInteger(value)) return false;
      if (value < 1 || value > length) return false;
      set.add(value);
    }

    return set.size === length;
  }
}
