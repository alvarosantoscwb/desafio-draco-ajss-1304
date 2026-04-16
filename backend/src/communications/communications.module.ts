import { Module } from '@nestjs/common';
import { CommunicationsController } from './communications.controller';
import { CommunicationsService } from './communications.service';
import { CronService } from './cron.service';
import { PjeService } from '../pje/pje.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CommunicationsController],
  providers: [CommunicationsService, CronService, PjeService, PrismaService],
})
export class CommunicationsModule {}
