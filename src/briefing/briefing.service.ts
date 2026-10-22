import { Injectable } from '@nestjs/common';
import type { Briefing, BriefingResponse } from './briefing.interface.js';
import { ClinicNotesClient } from './clinic-notes.client.js';
import { NotesXmlFormatter } from './notes-xml.formatter.js';
import { BriefingGenerator } from './briefing.generator.js';

const EMPTY_BRIEFING: Briefing = {
  resumo: 'Nenhuma anotação de consulta disponível para este cliente.',
  ultimoAtendimento: null,
  queixas: [],
  terapias: [],
  preferenciasESensibilidades: [],
  itensEmAberto: [],
  pontosDeAtencao: [],
};

@Injectable()
export class BriefingService {
  constructor(
    private readonly clinicNotes: ClinicNotesClient,
    private readonly formatter: NotesXmlFormatter,
    private readonly generator: BriefingGenerator,
  ) {}

  async generate(clientId: number): Promise<BriefingResponse> {
    const notes = await this.clinicNotes.fetchByClientId(clientId);

    const briefing = this.formatter.hasContent(notes)
      ? await this.generator.generate(this.formatter.format(notes))
      : EMPTY_BRIEFING;

    return { clientId, briefing };
  }
}
