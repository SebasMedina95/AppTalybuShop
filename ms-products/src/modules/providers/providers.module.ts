import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { PrismaModule } from '../../config/database/prisma.module';
import { Provider } from './entities/provider.entity';

@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService],
  imports: [
    PrismaModule,
    Provider
  ],
})
export class ProvidersModule {}
