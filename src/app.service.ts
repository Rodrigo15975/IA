import { Injectable } from '@nestjs/common'
import { HuggingfaceService } from './huggingface/huggingface.service'

@Injectable()
export class AppService {
  constructor(private readonly HuggingfaceService: HuggingfaceService) {}
  async getHello() {
    return await this.HuggingfaceService.generateImage()
    // return await this.HuggingfaceService.chatOtherModel(
    //   'Que es el scrapping, en programacion y dame ejemplo con node js',
    // )
    // return await this.HuggingfaceService.chatOtherModel(
    //   'Que es el scrapping, en programacion y dame ejemplo con node js',
    // )
  }
}
