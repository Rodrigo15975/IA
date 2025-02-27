import { Injectable } from '@nestjs/common'
import { HuggingfaceService } from './huggingface/huggingface.service'

@Injectable()
export class AppService {
  constructor(private readonly HuggingfaceService: HuggingfaceService) {}
  async getHello() {
    return await this.HuggingfaceService.generateCaption(
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd4OKe1DFGg3stwlr4kKgwmyOHsc6Su1FOMg&s',
    )
  }
}
