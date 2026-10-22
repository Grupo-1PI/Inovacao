import { Injectable } from '@nestjs/common';
import type { ClinicNote } from './briefing.interface.js';

@Injectable()
export class NotesXmlFormatter {
  format(notes: ClinicNote[]): string {
    const items = notes
      .filter((note) => note.observacao?.trim())
      .sort((a, b) => a.data.localeCompare(b.data))
      .map((note) => this.toXml(note));

    return `<notes>\n${items.join('\n')}\n</notes>`;
  }

  hasContent(notes: ClinicNote[]): boolean {
    return notes.some((note) => note.observacao?.trim());
  }

  private toXml(note: ClinicNote): string {
    const date = note.data.slice(0, 10);
    return `  <note id="${this.escapeAttribute(note.id)}" date="${date}">${this.escape(note.observacao!.trim())}</note>`;
  }

  private escape(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  private escapeAttribute(value: string): string {
    return this.escape(value).replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  }
}
