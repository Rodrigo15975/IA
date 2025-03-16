import { HuggingFaceInference } from '@langchain/community/llms/hf'
import { PromptTemplate } from '@langchain/core/prompts'
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ConversationChain } from 'langchain/chains'
import { MessageDto } from './dto/create-bot.dto'
import { ASISTENTE_TEMPLATE } from './common/template/templatePrompt'

@Injectable()
export class BotService {
  private readonly chatModel: HuggingFaceInference
  private readonly chain: ConversationChain
  private readonly apiKey: string = ''
  private readonly MODEL_IA: string = ''

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.getOrThrow<string>('HUGGINGFACE_API_KEY')
    this.MODEL_IA = this.configService.getOrThrow<string>('CHAT_MODEL')
    this.chatModel = new HuggingFaceInference({
      apiKey: this.apiKey,
      model: this.MODEL_IA,
      temperature: 0.8,
      maxTokens: 2048,
      cache: true,
    })
    const prompt = PromptTemplate.fromTemplate(ASISTENTE_TEMPLATE)
    this.chain = new ConversationChain({
      llm: this.chatModel,
      prompt,
    })
  }

  async langChaintService(messageDto: MessageDto) {
    try {
      const { message } = messageDto
      const response = await this.chain.call({
        input: message,
      })
      return {
        response,
        status: 200,
      }
    } catch (error) {
      Logger.error(`Error en chat: ${error} `)
      throw new HttpException(
        'Error al procesar la solicitud',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
