import { z } from 'zod';

export interface ClinicNote {
  id: string;
  data: string;
  observacao: string | null;
}

export interface ClinicNotesResponse {
  fkcliente: string;
  observacoes: ClinicNote[];
}

const idsNotas = z.array(z.string());

const Evolucao = z.enum(['melhorando', 'estavel', 'piorando', 'sem_informacao']);

export const BriefingSchema = z.object({
  resumo: z.string(),

  ultimoAtendimento: z
    .object({
      data: z.string(),
      resumo: z.string(),
      idsNotas,
    })
    .nullable(),

  queixas: z.array(
    z.object({
      descricao: z.string(),
      categoria: z.enum([
        'dor',
        'tensao_muscular',
        'coluna_postura',
        'estresse_ansiedade',
        'sono',
        'emocional',
        'outra',
      ]),
      localizacao: z.string().nullable(),
      primeiraMencao: z.string().nullable(),
      evolucao: Evolucao,
      idsNotas,
    }),
  ),

  terapias: z.array(
    z.object({
      nome: z.string(),
      tipo: z.enum([
        'acupuntura',
        'acupuntura_sem_agulhas',
        'auriculoterapia',
        'alinhamento_postural',
        'reiki',
        'constelacao_sistemica',
        'outra',
      ]),
      situacao: z.enum(['em_andamento', 'concluida', 'suspensa', 'sem_informacao']),
      evolucao: Evolucao,
      idsNotas,
    }),
  ),

  preferenciasESensibilidades: z.array(
    z.object({ descricao: z.string(), idsNotas }),
  ),

  itensEmAberto: z.array(z.object({ descricao: z.string(), idsNotas })),

  pontosDeAtencao: z.array(z.object({ descricao: z.string(), idsNotas })),
});

export type Briefing = z.infer<typeof BriefingSchema>;

export interface BriefingResponse {
  clientId: number;
  briefing: Briefing;
}
