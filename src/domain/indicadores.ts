import type { Cliente, Solicitacao } from './types'

export function indicadores(clientes: Cliente[], solicitacoes: Solicitacao[]) {
  const ativos = clientes.filter((c) => c.status === 'ativo')
  return {
    totalClientes: clientes.length,
    clientesAtivos: ativos.length,
    receitaTotal: clientes.reduce((s, c) => s + c.receita, 0),
    abertas: solicitacoes.filter((s) => s.status !== 'concluida').length,
    taxaConclusao: solicitacoes.length
      ? Math.round((solicitacoes.filter((s) => s.status === 'concluida').length / solicitacoes.length) * 100)
      : 0,
  }
}

/** Conta itens por mês (yyyy-mm), ordenado, para o gráfico de linha. */
export function porMes<T>(itens: T[], data: (i: T) => string, valor: (i: T) => number = () => 1) {
  const mapa = new Map<string, number>()
  for (const i of itens) {
    const k = data(i).slice(0, 7)
    mapa.set(k, (mapa.get(k) ?? 0) + valor(i))
  }
  return [...mapa.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([mes, total]) => ({ mes, total }))
}

export const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
export const rotuloMes = (ym: string) => MESES[Number(ym.slice(5, 7)) - 1]
