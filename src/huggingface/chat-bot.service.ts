import { Injectable, Logger } from '@nestjs/common'
// import { PromptTemplate } from '@langchain/core/prompts'
// import { ChatOpenAI } from '@langchain/openai'
// import { HttpResponseOutputParser } from 'langchain/output_parsers'
// import { HuggingFaceInference } from '@huggingface/inference'
// import { existsSync } from 'fs'
// import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
// import { Document } from '@langchain/core/documents'
// import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents'
// import {
//   ChatPromptTemplate,
//   MessagesPlaceholder,
// } from '@langchain/core/prompts'
// import { pull } from 'langchain/hub'
import { HfInference } from '@huggingface/inference'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ChatBotsService {
  private hf: HfInference

  constructor(private readonly configService: ConfigService) {
    this.hf = new HfInference(
      this.configService.get<string>('HUGGINGFACE_API_KEY'),
    )
  }

  async generateResponse(prompt: string) {
    try {
      const response = await this.hf.textGeneration({
        model: 'facebook/blenderbot-3B', // Modelo de chat optimizado
        inputs: prompt,
        parameters: {
          max_length: 50, // Limita la longitud de la respuesta
          temperature: 0.7, // Controla la creatividad (0 = conservador, 1 = creativo)
        },
      })
      Logger.debug('Prompt enviado al modelo:', prompt)
      Logger.debug('Respuesta completa del modelo:', response)
      return { response: response.generated_text }
    } catch (error) {
      Logger.error('Error al procesar con la IA', error)
    }
  }
}
