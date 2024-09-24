import { Injectable } from '@nestjs/common';

@Injectable()
export class FileTypeValidator {
  constructor(private readonly options: { fileType: string }) {}

  isValid(file: Express.Multer.File): boolean {
    const regex = new RegExp(this.options.fileType);
    return regex.test(file.mimetype);
  }

  get fileType(): string {
    return this.options.fileType;
  }
}