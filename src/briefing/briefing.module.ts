import { Module } from '@nestjs/common';
import { BriefingController } from './briefing.controller.js';
import { BriefingService } from './briefing.service.js';
import { ClinicNotesClient } from './clinic-notes.client.js';
import { NotesXmlFormatter } from './notes-xml.formatter.js';
import { BriefingGenerator } from './briefing.generator.js';

@Module({
  controllers: [BriefingController],
  providers: [
    BriefingService,
    ClinicNotesClient,
    NotesXmlFormatter,
    BriefingGenerator,
  ],
})
export class BriefingModule {}
