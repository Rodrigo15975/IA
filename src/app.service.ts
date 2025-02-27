import { Injectable } from '@nestjs/common'
import { HuggingfaceService } from './huggingface/huggingface.service'

@Injectable()
export class AppService {
  constructor(private readonly HuggingfaceService: HuggingfaceService) {}
  async getHello() {
    return await this.HuggingfaceService.chat(
      'Que es el scrapping, en programacion',
    )
  }
}
