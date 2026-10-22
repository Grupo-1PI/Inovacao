import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  ClinicNote,
  ClinicNotesResponse,
} from './briefing.interface.js';

const USE_MOCK = true;

const MOCK_RESPONSE: ClinicNotesResponse = {
  fkcliente: '123',
  observacoes: [
    {
      id: 'nota-001',
      data: '2026-08-04T09:00:00-03:00',
      observacao: 'Relata dor lombar após longos períodos sentada. Iniciada acupuntura.',
    },
    {
      id: 'nota-002',
      data: '2026-08-18T09:30:00-03:00',
      observacao: 'Dor lombar diminuiu. Refere tensão muscular nos ombros. Mantida acupuntura.',
    },
    {
      id: 'nota-003',
      data: '2026-09-01T10:00:00-03:00',
      observacao: 'Sono melhor na última semana. Sensível a agulhas; conversar sobre alternativa na próxima sessão.',
    },
    {
      id: 'nota-004',
      data: '2026-09-15T10:00:00-03:00',
      observacao: null,
    },
  ],
};

@Injectable()
export class ClinicNotesClient {
  private readonly baseUrl: string;

  constructor(config: ConfigService) {
    this.baseUrl = config.getOrThrow<string>('CLINIC_API_URL');
  }

  async fetchByClientId(clientId: number): Promise<ClinicNote[]> {
    if (USE_MOCK) {
      return MOCK_RESPONSE.fkcliente === String(clientId)
        ? MOCK_RESPONSE.observacoes
        : [];
    }

    const url = `${this.baseUrl}/v1/clients/${clientId}/notes`;

    let res: Response;
    try {
      res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    } catch {
      throw new BadGatewayException('Clinic API unreachable');
    }

    if (res.status === 404) throw new NotFoundException('Client not found');
    if (!res.ok) throw new BadGatewayException(`Clinic API error ${res.status}`);

    const result = (await res.json()) as ClinicNotesResponse;
    return result.observacoes;
  }
}
