import { Body, Controller, Post, VERSION_NEUTRAL } from '@nestjs/common'
import { BotService } from './bot.service'
import { MessageDto } from './dto/create-bot.dto'

@Controller({
  path: 'bot',
  version: VERSION_NEUTRAL,
})
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('/chat')
  chat(@Body() messageDto: MessageDto) {
    return this.botService.langChaintService(messageDto)
  }
  @Post('explain')
  explain(@Body() messageDto: MessageDto) {
    const modifiedQuery = `Explícame de manera simple y educativa: ${messageDto.message}`
    return this.botService.langChaintService({ message: modifiedQuery })
  }
}
