import { buscar, dentroDoPeriodo, ordenar, paginar, type Direcao } from './consulta'
import type { Cliente, Solicitacao, StatusCliente, StatusSolicitacao } from './types'

export type CampoCliente = 'nome' | 'empresa' | 'cidade' | 'status' | 'criadoEm' | 'receita'

export interface FiltroClientes {
  busca: string
  status: StatusCliente | ''
  cidade: string
  ordem: CampoCliente
  direcao: Direcao
  pagina: number
  tamanho: number
}

export function consultarClientes(clientes: Cliente[], f: FiltroClientes) {
  let r = buscar(clientes, f.busca, (c) => [c.nome, c.email, c.empresa])
  if (f.status) r = r.filter((c) => c.status === f.status)
  if (f.cidade) r = r.filter((c) => c.cidade === f.cidade)
  r = ordenar(r, (c) => c[f.ordem], f.direcao)
  return paginar(r, f.pagina, f.tamanho)
}

export interface FiltroSolicitacoes {
  busca?: string
  status?: StatusSolicitacao | ''
  de?: string
  ate?: string
}

export function filtrarSolicitacoes(lista: Solicitacao[], f: FiltroSolicitacoes): Solicitacao[] {
  let r = buscar(lista, f.busca ?? '', (s) => [s.titulo, s.id])
  if (f.status) r = r.filter((s) => s.status === f.status)
  r = r.filter((s) => dentroDoPeriodo(s.criadaEm, f.de, f.ate))
  return r
}

export function contarPor<T, K extends string>(itens: T[], chave: (i: T) => K): Record<K, number> {
  const out = {} as Record<K, number>
  for (const i of itens) out[chave(i)] = (out[chave(i)] ?? 0) + 1
  return out
}
