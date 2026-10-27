import { Badge } from './ui'
import { ROTULO_PRIORIDADE, ROTULO_STATUS_CLIENTE, ROTULO_STATUS_SOLICITACAO, type Prioridade, type StatusCliente, type StatusSolicitacao } from '../domain/types'

const TOM_CLIENTE = { ativo: 'verde', pendente: 'amarelo', inativo: 'cinza' } as const
const TOM_SOL = { aberta: 'azul', em_andamento: 'amarelo', concluida: 'verde' } as const
const TOM_PRIO = { alta: 'vermelho', media: 'amarelo', baixa: 'cinza' } as const

export const StatusClienteBadge = ({ s }: { s: StatusCliente }) => <Badge tom={TOM_CLIENTE[s]}>{ROTULO_STATUS_CLIENTE[s]}</Badge>
export const StatusSolBadge = ({ s }: { s: StatusSolicitacao }) => <Badge tom={TOM_SOL[s]}>{ROTULO_STATUS_SOLICITACAO[s]}</Badge>
export const PrioridadeBadge = ({ p }: { p: Prioridade }) => <Badge tom={TOM_PRIO[p]}>{ROTULO_PRIORIDADE[p]}</Badge>
