import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { BriefingResponse } from './briefing.interface.js';
import { BriefingService } from './briefing.service.js';

@Controller('clients/:clientId/briefing')
@ApiTags('Briefing')
export class BriefingController {
  constructor(private readonly service: BriefingService) {}

  @Get()
  @ApiOperation({ summary: 'Gera o briefing de um cliente' })
  @ApiParam({ name: 'clientId', type: Number, description: 'ID do cliente' })
  @ApiOkResponse({
    description: 'Briefing gerado com sucesso.',
    schema: {
      type: 'object',
      properties: {
        clientId: { type: 'integer', example: 123 },
        briefing: {
          type: 'object',
          example: {
            resumo: 'Dor lombar diminuiu; tensão nos ombros relatada.',
            ultimoAtendimento: {
              data: '2026-09-01',
              resumo: 'Sono melhor; sensibilidade a agulhas.',
              idsNotas: ['N3'],
            },
            queixas: [],
            terapias: [],
            preferenciasESensibilidades: [],
            itensEmAberto: [],
            pontosDeAtencao: [],
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'O ID do cliente não é um número válido.' })
  @ApiNotFoundResponse({ description: 'Cliente não encontrado na Clinic API.' })
  @ApiBadGatewayResponse({
    description: 'Falha em um serviço externo. A resposta pode indicar chave OpenAI inválida ou modelo inexistente.',
    content: {
      'application/json': {
        examples: {
          invalidApiKey: {
            summary: 'Chave OpenAI inválida',
            value: {
              statusCode: 502,
              code: 'OPENAI_INVALID_API_KEY',
              message: 'A chave OPENAI_API_KEY foi rejeitada pelo provedor.',
            },
          },
          invalidModel: {
            summary: 'Modelo OpenAI inválido ou indisponível',
            value: {
              statusCode: 502,
              code: 'OPENAI_INVALID_MODEL',
              message: 'O modelo definido em OPENAI_MODEL não foi encontrado ou não está disponível.',
            },
          },
        },
      },
    },
  })
  get(
    @Param('clientId', ParseIntPipe) clientId: number,
  ): Promise<BriefingResponse> {
    return this.service.generate(clientId);
  }
}
