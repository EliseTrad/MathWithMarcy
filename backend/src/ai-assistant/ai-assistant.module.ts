import { Module } from '@nestjs/common';
import { AiAssistantController } from './ai-assistant.controller';

@Module({
  controllers: [AiAssistantController],
})
export class AiAssistantModule {}
