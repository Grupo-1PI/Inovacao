import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APIError } from 'openai';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { Briefing, BriefingSchema } from './briefing.interface.js';
import { BRIEFING_SYSTEM_PROMPT } from './briefing.prompt.js';

@Injectable()
export class BriefingGenerator {
  private readonly openai: OpenAI;
  private readonly model: string;

  constructor(config: ConfigService) {
    this.openai = new OpenAI({
      apiKey: config.getOrThrow<string>('OPENAI_API_KEY'),
      timeout: 30_000,
    });
    this.model = config.getOrThrow<string>('OPENAI_MODEL');
  }

  async generate(notesXml: string): Promise<Briefing> {
    let response;
    try {
      response = await this.openai.responses.parse({
        model: this.model,
        store: false,
        instructions: BRIEFING_SYSTEM_PROMPT,
        input: notesXml,
        text: { format: zodTextFormat(BriefingSchema, 'briefing') },
      });
    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 401 || error.code === 'invalid_api_key') {
          throw new BadGatewayException({
            code: 'OPENAI_INVALID_API_KEY',
            message: 'A chave OPENAI_API_KEY foi rejeitada pelo provedor.',
          });
        }

        if (error.status === 404 || error.code === 'model_not_found') {
          throw new BadGatewayException({
            code: 'OPENAI_INVALID_MODEL',
            message: 'O modelo definido em OPENAI_MODEL não foi encontrado ou não está disponível.',
          });
        }
      }

      throw error;
    }

    if (!response.output_parsed) {
      throw new BadGatewayException('LLM returned no valid briefing');
    }
    return response.output_parsed;
  }
}
