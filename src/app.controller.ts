import { Body, Controller, Post } from '@nestjs/common'
import { AppService } from './app.service'

@Controller('chat')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  getHello(@Body() message: { message: string }) {
    return this.appService.getHello(message.message)
  }
}
