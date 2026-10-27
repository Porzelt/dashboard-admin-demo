import { useMemo, useState } from 'react'
import { Card, PageHeader } from '../components/ui'
import { CampoBusca, FilterBar, Selecao } from '../components/FilterBar'
import { Table, type Coluna } from '../components/Table'
import { PrioridadeBadge, StatusSolBadge } from '../components/badges'
import { contarPor, filtrarSolicitacoes } from '../domain/consultas'
import { dataBr } from '../domain/formatar'
import { ROTULO_STATUS_SOLICITACAO, type Solicitacao, type StatusSolicitacao } from '../domain/types'
import { useDados } from '../state'

export function Solicitacoes() {
  const { solicitacoes, clientes, atualizarStatus } = useDados()
  const [status, setStatus] = useState<StatusSolicitacao | ''>('')
  const [busca, setBusca] = useState('')
  const [sel, setSel] = useState<string | null>(null)

  const nomeCliente = (id: string) => clientes.find((c) => c.id === id)?.nome ?? '—'
  const contagem = useMemo(() => contarPor(solicitacoes, (s) => s.status), [solicitacoes])
  const lista = useMemo(() => filtrarSolicitacoes(solicitacoes, { status, busca }), [solicitacoes, status, busca])
  const detalhe = solicitacoes.find((s) => s.id === sel)

  const colunas: Coluna<Solicitacao>[] = [
    { chave: 'titulo', titulo: 'Assunto', render: (s) => <><strong>{s.titulo}</strong><div className="muted">{nomeCliente(s.clienteId)}</div></> },
    { chave: 'status', titulo: 'Status', render: (s) => <StatusSolBadge s={s.status} /> },
    { chave: 'prioridade', titulo: 'Prioridade', render: (s) => <PrioridadeBadge p={s.prioridade} /> },
    { chave: 'criadaEm', titulo: 'Aberta em', render: (s) => dataBr(s.criadaEm) },
  ]

  return (
    <>
      <PageHeader titulo="Solicitações" subtitulo="Acompanhe o andamento" />
      <div className="abas" role="tablist" aria-label="Filtrar por status">
        {([['', 'Todas', solicitacoes.length], ...(Object.keys(ROTULO_STATUS_SOLICITACAO) as StatusSolicitacao[]).map((s) => [s, ROTULO_STATUS_SOLICITACAO[s], contagem[s] ?? 0])] as [string, string, number][]).map(([v, r, n]) => (
          <button key={v} type="button" role="tab" aria-selected={status === v} className={`aba ${status === v ? 'ativa' : ''}`} onClick={() => setStatus(v as StatusSolicitacao | '')}>
            {r} <span className="contador">{n}</span>
          </button>
        ))}
      </div>
      <div className={`split ${detalhe ? 'com-detalhe' : ''}`}>
        <Card>
          <FilterBar>
            <CampoBusca valor={busca} onChange={setBusca} placeholder="Buscar assunto ou código" />
            <Selecao rotulo="Status" valor={status} onChange={(v) => setStatus(v as StatusSolicitacao | '')} opcoes={Object.entries(ROTULO_STATUS_SOLICITACAO).map(([valor, rotulo]) => ({ valor, rotulo }))} />
          </FilterBar>
          <Table colunas={colunas} linhas={lista} chaveLinha={(s) => s.id} onLinha={(s) => setSel(s.id)} vazio="Nenhuma solicitação com esse filtro." />
        </Card>
        {detalhe && (
          <Card titulo={`Solicitação #${detalhe.id}`} acao={<button type="button" className="btn btn-ghost" onClick={() => setSel(null)} aria-label="Fechar detalhe">✕</button>} className="detalhe">
            <h3>{detalhe.titulo}</h3>
            <p>{detalhe.descricao}</p>
            <dl className="dl">
              <dt>Cliente</dt>
              <dd>{nomeCliente(detalhe.clienteId)}</dd>
              <dt>Prioridade</dt>
              <dd><PrioridadeBadge p={detalhe.prioridade} /></dd>
              <dt>Aberta em</dt>
              <dd>{dataBr(detalhe.criadaEm)}</dd>
              <dt>Atualizada em</dt>
              <dd>{dataBr(detalhe.atualizadaEm)}</dd>
            </dl>
            <label className="campo">
              <span>Alterar status</span>
              <select className="input" value={detalhe.status} onChange={(e) => atualizarStatus(detalhe.id, e.target.value as StatusSolicitacao)}>
                {Object.entries(ROTULO_STATUS_SOLICITACAO).map(([v, r]) => (
                  <option key={v} value={v}>{r}</option>
                ))}
              </select>
            </label>
          </Card>
        )}
      </div>
    </>
  )
}
