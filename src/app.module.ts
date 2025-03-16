import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { HuggingfaceService } from './huggingface/huggingface.service'
import { ConfigModule } from '@nestjs/config'
import { ChatBotsService } from './huggingface/chat-bot.service'
import { BotModule } from './bot/bot.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BotModule,
  ],
  controllers: [AppController],
  providers: [AppService, HuggingfaceService, ChatBotsService],
})
export class AppModule {}
