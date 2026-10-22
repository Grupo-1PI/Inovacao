import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BriefingModule } from './briefing/briefing.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), BriefingModule],
})
export class AppModule {}
