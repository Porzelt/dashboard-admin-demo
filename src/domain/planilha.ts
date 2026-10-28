import type { Cell, SheetData } from 'write-excel-file/browser'
import { baixarArquivo } from './csv'

export interface ColunaPlanilha<T> {
  titulo: string
  valor: (item: T) => string | number | Date
  /** Largura em caracteres. */
  largura?: number
  /** Formato do Excel para números e datas (ex.: '#,##0.00'). */
  formato?: string
}

const FORMATO_DATA = 'dd/mm/yyyy'

/** Converte 'yyyy-mm-dd' em Date (UTC) para o Excel tratar como data de verdade, e não texto. */
export const dataExcel = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`)

function celula(v: string | number | Date, formato?: string): Cell {
  if (v instanceof Date) return { value: v, type: Date, format: formato ?? FORMATO_DATA }
  if (typeof v === 'number') return { value: v, type: Number, format: formato }
  // Texto é gravado como string literal: um valor iniciando com '=' não vira fórmula.
  return { value: v, type: String }
}

/** Monta as linhas da planilha (cabeçalho em negrito + dados tipados). Função pura, testável. */
export function montarPlanilha<T>(itens: T[], colunas: ColunaPlanilha<T>[]): { dados: SheetData; larguras: { width: number }[] } {
  const cabecalho: Cell[] = colunas.map((c) => ({ value: c.titulo, fontWeight: 'bold', backgroundColor: '#E2E8F0' }))
  const linhas = itens.map((i) => colunas.map((c) => celula(c.valor(i), c.formato)))
  return { dados: [cabecalho, ...linhas], larguras: colunas.map((c) => ({ width: c.largura ?? Math.max(12, c.titulo.length + 2) })) }
}

/** Gera e baixa o .xlsx. A biblioteca só é carregada no clique, sem pesar na abertura do painel. */
export async function baixarExcel<T>(nome: string, itens: T[], colunas: ColunaPlanilha<T>[], aba = 'Dados'): Promise<void> {
  const { default: writeXlsxFile } = await import('write-excel-file/browser')
  const { dados, larguras } = montarPlanilha(itens, colunas)
  const blob = await writeXlsxFile(dados, { columns: larguras, sheet: aba, stickyRowsCount: 1 }).toBlob()
  baixarArquivo(nome, blob)
}
