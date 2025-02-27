import { HfInference } from '@huggingface/inference'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class HuggingfaceService {
  private hf: HfInference
  private readonly logger = new Logger(HuggingfaceService.name)

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('HUGGINGFACE_API_KEY')
    if (!apiKey) {
      throw new Error('HUGGINGFACE_API_KEY is not defined')
    }
    this.hf = new HfInference(apiKey)
  }

  async generateCaption(imageUrl: string) {
    try {
      this.logger.debug('Generating caption...')
      const response = await this.hf.textToImage({
        model: 'Qwen/Qwen2.5-VL-7B-Instruct',
        inputs: imageUrl,
      })
      return response
    } catch (error) {
      this.logger.error('Error generating caption:', error)
      throw error
    }
  }

  async generateText(
    prompt: string = 'Que es inteligencia artificial, dame un documental',
  ): Promise<string> {
    try {
      const response = await this.hf.textGeneration({
        model: 'gpt2', // Modelo de traducción
        inputs: prompt,
        parameters: {
          max_length: 20, // Aumenta la longitud máxima
          temperature: 0.7, // Ajusta la temperatura
          do_sample: true, // Habilita el muestreo
        },
      })
      this.logger.debug(`Generated text `, response)

      return response.generated_text
    } catch (error) {
      this.logger.error(`Text generation failed: ${error}`, error)
      throw new Error(`Failed to generate text: ${error}`)
    }
  }
  // async generateText(prompt: string = 'Hola?') {
  //   try {
  //     const response = await this.hf.request({
  //       model: 'Helsinki-NLP/opus-mt-es-en',
  //       inputs: prompt,
  //     })
  //     this.logger.debug('Translated text ', response)
  //     return {
  //       response,
  //     }
  //     return {}
  //   } catch (error) {
  //     this.logger.error(`Text generation failed: ${error}`, error)
  //     throw new Error(`Failed to generate text: ${error}`)
  //   }
  // }

  async chatCompletion(messages: Array<{ role: string; content: string }>) {
    try {
      const response = await this.hf.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.2', // Better model for chat completion
        inputs: this.formatChatMessages(messages),
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.95,
        },
      })

      return response.generated_text
    } catch (error) {
      this.logger.error(`Chat completion failed: ${error}`, error)
      throw new Error(`Failed to complete chat: ${error}`)
    }
  }

  private formatChatMessages(
    messages: Array<{ role: string; content: string }>,
  ): string {
    // Format messages for Mistral instruction format
    return messages
      .map((msg) => {
        if (msg.role === 'user') {
          return `[INST] ${msg.content} [/INST]`
        }
        return msg.content
      })
      .join('\n')
  }
}
