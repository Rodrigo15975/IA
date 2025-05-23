import { HfInference } from '@huggingface/inference'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
@Injectable()
export class HuggingfaceService {
  private hf: HfInference
  private readonly logger = new Logger(HuggingfaceService.name)

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('HUGGINGFACE_API_KEY')
    if (!apiKey) throw new Error('HUGGINGFACE_API_KEY is not defined')

    this.hf = new HfInference(apiKey)
  }

  async chat(prompt: string) {
    try {
      this.logger.debug(`Prompt: ${prompt}`)
      const response = await this.hf.textGeneration({
        model: 'HuggingFaceH4/zephyr-7b-alpha',
        inputs: prompt,
        parameters: { max_new_tokens: 200 },
      })
      return {
        response: response.generated_text,
        details: response.details,
        model: response.model,
        status: 200,
      }
    } catch (error) {
      this.logger.error('Error en chat:', error)
      throw error
    }
  }

  async generateImage() {
    const response = await this.hf.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: 'Un bosque mágico con luces de neón',
    })
    this.logger.debug({
      response,
    })
    return {
      response: response,
      status: 200,
    }
  }
  async chatOtherModel(prompt: string) {
    try {
      this.logger.debug(`Prompt: ${prompt}`)
      const response = await this.hf.textGeneration({
        model: 'meta-llama/Meta-Llama-3-8B-Instruct', // CORRECTO
        inputs: prompt,
        parameters: { max_new_tokens: 200 },
      })
      this.logger.debug({
        response: response.generated_text,
        details: response.details,
      })
      return {
        response: response.generated_text,
        details: response.details,
        model: response.model,
        status: 200,
      }
    } catch (error) {
      this.logger.error('Error en chat:', error)
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
