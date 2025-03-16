import { Injectable } from '@nestjs/common'
import { HuggingfaceService } from './huggingface/huggingface.service'
import { ChatBotsService } from './huggingface/chat-bot.service'

@Injectable()
export class AppService {
  constructor(
    private readonly HuggingfaceService: HuggingfaceService,
    private readonly chatBotService: ChatBotsService,
  ) {}
  async getHello(message: string) {
    // return await this.HuggingfaceService.generateImage()
    return await this.chatBotService.chatGPT(message)
    // return await this.HuggingfaceService.chatOtherModel(
    //   'Que es el scrapping, en programacion y dame ejemplo con node js',
    // )
  }
}
