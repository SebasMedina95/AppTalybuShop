import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { CloudinaryProvider } from './files.provider';

@Module({
  providers: [
    CloudinaryProvider, 
    FilesService
  ],
  exports: [
    CloudinaryProvider, 
    FilesService],
})

export class FilesModule {}