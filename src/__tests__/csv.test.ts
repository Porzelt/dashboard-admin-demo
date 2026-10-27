import { gerarCsv } from '../domain/csv'

type Item = { n: string; v: number }
const cols = [
  { titulo: 'Nome', valor: (i: Item) => i.n },
  { titulo: 'Valor', valor: (i: Item) => i.v },
]

describe('gerarCsv', () => {
  it('usa ponto e vírgula, CRLF e BOM', () => {
    const csv = gerarCsv([{ n: 'Ana', v: 10 }], cols)
    expect(csv.startsWith('﻿')).toBe(true)
    expect(csv.slice(1).split('\r\n')).toEqual(['Nome;Valor', 'Ana;10'])
  })
  it('escapa aspas, ponto e vírgula e quebras de linha', () => {
    const csv = gerarCsv([{ n: 'A "B"; C\nD', v: 1 }], cols)
    expect(csv).toContain('"A ""B""; C\nD";1')
  })
  it('neutraliza fórmulas', () => {
    expect(gerarCsv([{ n: '=SOMA(A1)', v: 1 }], cols)).toContain("'=SOMA(A1);1")
  })
  it('lista vazia gera só o cabeçalho', () => {
    expect(gerarCsv([], cols).slice(1)).toBe('Nome;Valor')
  })
})
