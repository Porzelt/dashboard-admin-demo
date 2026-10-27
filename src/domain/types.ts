export type StatusCliente = 'ativo' | 'inativo' | 'pendente'
export type StatusSolicitacao = 'aberta' | 'em_andamento' | 'concluida'
export type Prioridade = 'baixa' | 'media' | 'alta'

export interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
  empresa: string
  cidade: string
  status: StatusCliente
  criadoEm: string // ISO yyyy-mm-dd
  receita: number
}

export type NovoCliente = Omit<Cliente, 'id' | 'criadoEm' | 'receita'>

export interface Solicitacao {
  id: string
  titulo: string
  descricao: string
  clienteId: string
  status: StatusSolicitacao
  prioridade: Prioridade
  criadaEm: string
  atualizadaEm: string
}

export interface Atividade {
  id: string
  texto: string
  em: string // ISO datetime
}

export const ROTULO_STATUS_CLIENTE: Record<StatusCliente, string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  pendente: 'Pendente',
}

export const ROTULO_STATUS_SOLICITACAO: Record<StatusSolicitacao, string> = {
  aberta: 'Aberta',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
}

export const ROTULO_PRIORIDADE: Record<Prioridade, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
}
