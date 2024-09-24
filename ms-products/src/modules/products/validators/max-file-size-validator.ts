import { Injectable } from '@nestjs/common';

@Injectable()
export class MaxFileSizeValidator {
  constructor(private readonly options: { maxSize: number }) {}

  isValid(file: Express.Multer.File): boolean {
    return file.size <= this.options.maxSize;
  }

  get maxSize(): number {
    return this.options.maxSize;
  }
}