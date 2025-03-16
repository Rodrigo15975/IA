import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
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
// import { ChatOpenAI } from '@langchain/openai'
// import { PromptTemplate } from '@langchain/core/prompts'
// import { StringOutputParser } from '@langchain/core/output_parsers'

import { HuggingFaceInference } from '@langchain/community/llms/hf'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
@Injectable()
export class ChatBotsService {
  private readonly hf: HfInference
  private readonly conversationHistory: string[] = []
  private readonly chatModel: HuggingFaceInference

  // private readonly chatModel: ChatOpenAI
  // private readonly chatModel: ChatOllama;
  constructor(private readonly configService: ConfigService) {
    this.hf = new HfInference(
      this.configService.get<string>('HUGGINGFACE_API_KEY'),
    )
    this.chatModel = new HuggingFaceInference({
      apiKey: this.configService.get<string>('HUGGINGFACE_API_KEY'), // Clave API de Hugging Face
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1', // Modelo gratuito en HF
      temperature: 0.8,
      // maxTokens: ,
    })
    // this.chatModel = new ChatOpenAI({
    //   openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
    //   modelName: 'gpt-3.5-turbo-1106', // Modelo actualizado para 2025
    //   temperature: 0.7,
    // })
  }

  async chatGPT(basicMessageDto: string) {
    try {
      const promptTemplate = PromptTemplate.fromTemplate(
        'Eres un asistente útil. Responde a la siguiente consulta: {query}',
      )

      const chain = promptTemplate
        .pipe(this.chatModel)
        .pipe(new StringOutputParser())

      const response = await chain.invoke({
        query: basicMessageDto,
      })

      const formatResponse = this.formatMessage(response)
      return { formatResponse }
    } catch (error) {
      Logger.error(`Error in chatGPT: ${error.message}`, error.stack)
      throw new HttpException(
        'Error al procesar la solicitud',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
  private formatMessage(response: string) {
    return response.split('\n').join('')
  }

  async generateResponse(prompt: string) {
    Logger.debug('History conversation: ', {
      conversationHistory: this.conversationHistory,
      prompt,
    })
    try {
      this.conversationHistory.push(`User: ${prompt}`)
      const context = this.conversationHistory.join('\n')
      console.log({
        context,
      })

      const response = await this.hf.textGeneration({
        model: 'mbart-large-50',
        inputs: prompt,
        parameters: {
          max_length: 50, // Respuestas más cortas
          temperature: 0.8, // Menos creatividad, más velocidad
          top_k: 50, // Limita las opciones de generación
          top_p: 0.9, // Limita las opciones de generación
          num_return_sequences: 1, // Solo una respuesta
          max_new_tokens: 50, // Limita la longitud de la respuesta
        },
      })
      Logger.debug('Prompt enviado al modelo:', { prompt })
      Logger.debug('Respuesta completa del modelo:', { response })
      this.conversationHistory.push(`Bot: ${response.generated_text}`)
      return { response: response.generated_text }
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException(
        'Error al procesar con la IA',
        error,
      )
    }
  }
}
