import { Injectable } from '@nestjs/common'
import { HfInference, TextGenerationOutput } from '@huggingface/inference'
@Injectable()
export class HuggingfaceService {
  private hf: HfInference
  constructor() {
    const apiKey = process.env.HUGGINGFACE_API_KEY
    if (!apiKey) throw new Error('HUGGINGFACE_API_KEY is not defined')
    this.hf = new HfInference(apiKey)
  }

  async chatWithAI() {
    try {
      return {
        message: await this.hf.textGeneration({
          model: 'openai-gpt',
          inputs: 'How are you?',
        }),
      }
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }
}
