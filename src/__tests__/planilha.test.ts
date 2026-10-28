// @vitest-environment node
import writeXlsxFile from 'write-excel-file/node'
import { dataExcel, montarPlanilha, type ColunaPlanilha } from '../domain/planilha'

type Item = { nome: string; valor: number; data: string }
const colunas: ColunaPlanilha<Item>[] = [
  { titulo: 'Nome', valor: (i) => i.nome, largura: 30 },
  { titulo: 'Valor', valor: (i) => i.valor, formato: '#,##0.00' },
  { titulo: 'Data', valor: (i) => dataExcel(i.data) },
]
const itens: Item[] = [
  { nome: 'Ana', valor: 1234.5, data: '2026-03-10' },
  { nome: '=SOMA(A1)', valor: 2, data: '2026-12-31' },
]

describe('montarPlanilha', () => {
  it('cabeçalho em negrito e uma linha por item', () => {
    const { dados } = montarPlanilha(itens, colunas)
    expect(dados).toHaveLength(3)
    expect(dados[0]).toEqual([
      expect.objectContaining({ value: 'Nome', fontWeight: 'bold' }),
      expect.objectContaining({ value: 'Valor', fontWeight: 'bold' }),
      expect.objectContaining({ value: 'Data', fontWeight: 'bold' }),
    ])
  })

  it('mantém tipos: texto, número com formato e data de verdade', () => {
    const [, linha] = montarPlanilha(itens, colunas).dados
    expect(linha[0]).toEqual({ value: 'Ana', type: String })
    expect(linha[1]).toEqual({ value: 1234.5, type: Number, format: '#,##0.00' })
    expect(linha[2]).toMatchObject({ type: Date, format: 'dd/mm/yyyy' })
    expect((linha[2] as { value: Date }).value.toISOString()).toBe('2026-03-10T00:00:00.000Z')
  })

  it('texto que parece fórmula continua texto', () => {
    expect(montarPlanilha(itens, colunas).dados[2][0]).toEqual({ value: '=SOMA(A1)', type: String })
  })

  it('usa a largura informada ou uma mínima a partir do título', () => {
    expect(montarPlanilha(itens, colunas).larguras).toEqual([{ width: 30 }, { width: 12 }, { width: 12 }])
  })

  it('lista vazia gera só o cabeçalho', () => {
    expect(montarPlanilha([], colunas).dados).toHaveLength(1)
  })
})

describe('arquivo .xlsx', () => {
  it('gera um arquivo válido (zip) com os dados', async () => {
    const { dados, larguras } = montarPlanilha(itens, colunas)
    const buffer = await writeXlsxFile(dados, { columns: larguras, sheet: 'Dados', stickyRowsCount: 1 }).toBuffer()
    expect(buffer.subarray(0, 2).toString()).toBe('PK')
    expect(buffer.length).toBeGreaterThan(1000)
  })
})
