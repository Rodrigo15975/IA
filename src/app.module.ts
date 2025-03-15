import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { HuggingfaceService } from './huggingface/huggingface.service'
import { ConfigModule } from '@nestjs/config'
import { ChatBotsService } from './huggingface/chat-bot.service'

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, HuggingfaceService, ChatBotsService],
})
export class AppModule {}
