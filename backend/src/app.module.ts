import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { CommunicationsModule } from './communications/communications.module';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule, CommunicationsModule],
})
export class AppModule {}
