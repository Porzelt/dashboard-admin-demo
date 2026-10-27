import { useMemo, useState } from 'react'
import { Card, Kpi, PageHeader } from '../components/ui'
import { CampoData, FilterBar, Selecao } from '../components/FilterBar'
import { Table, type Coluna } from '../components/Table'
import { StatusSolBadge } from '../components/badges'
import { GraficoBarra } from '../components/Chart'
import { baixarCsv, gerarCsv, type ColunaCsv } from '../domain/csv'
import { filtrarSolicitacoes } from '../domain/consultas'
import { dataBr } from '../domain/formatar'
import { ROTULO_PRIORIDADE, ROTULO_STATUS_SOLICITACAO, type Solicitacao, type StatusSolicitacao } from '../domain/types'
import { useDados } from '../state'

export function colunasCsv(nomeCliente: (id: string) => string): ColunaCsv<Solicitacao>[] {
  return [
    { titulo: 'Código', valor: (s) => s.id },
    { titulo: 'Assunto', valor: (s) => s.titulo },
    { titulo: 'Cliente', valor: (s) => nomeCliente(s.clienteId) },
    { titulo: 'Status', valor: (s) => ROTULO_STATUS_SOLICITACAO[s.status] },
    { titulo: 'Prioridade', valor: (s) => ROTULO_PRIORIDADE[s.prioridade] },
    { titulo: 'Aberta em', valor: (s) => dataBr(s.criadaEm) },
  ]
}

export function Relatorios() {
  const { solicitacoes, clientes } = useDados()
  const [status, setStatus] = useState<StatusSolicitacao | ''>('')
  const [de, setDe] = useState('')
  const [ate, setAte] = useState('')
  const nomeCliente = (id: string) => clientes.find((c) => c.id === id)?.nome ?? '—'
  const lista = useMemo(() => filtrarSolicitacoes(solicitacoes, { status, de, ate }), [solicitacoes, status, de, ate])
  const porPrioridade = (['alta', 'media', 'baixa'] as const).map((p) => ({ nome: ROTULO_PRIORIDADE[p], valor: lista.filter((s) => s.prioridade === p).length }))

  const colunas: Coluna<Solicitacao>[] = [
    { chave: 'id', titulo: 'Código', render: (s) => s.id },
    { chave: 'titulo', titulo: 'Assunto', render: (s) => s.titulo },
    { chave: 'cliente', titulo: 'Cliente', render: (s) => nomeCliente(s.clienteId) },
    { chave: 'status', titulo: 'Status', render: (s) => <StatusSolBadge s={s.status} /> },
    { chave: 'criadaEm', titulo: 'Aberta em', render: (s) => dataBr(s.criadaEm) },
  ]

  return (
    <>
      <PageHeader
        titulo="Relatórios"
        subtitulo="Filtre por período e status, exporte ou imprima"
        acoes={
          <>
            <button type="button" className="btn btn-primario" disabled={lista.length === 0} onClick={() => baixarCsv('solicitacoes.csv', gerarCsv(lista, colunasCsv(nomeCliente)))}>
              Exportar CSV
            </button>
            <button type="button" className="btn" onClick={() => window.print()}>
              Imprimir / PDF
            </button>
          </>
        }
      />
      <Card>
        <FilterBar
          onLimpar={() => {
            setStatus('')
            setDe('')
            setAte('')
          }}
        >
          <CampoData rotulo="De" valor={de} onChange={setDe} />
          <CampoData rotulo="Até" valor={ate} onChange={setAte} />
          <Selecao rotulo="Status" valor={status} onChange={(v) => setStatus(v as StatusSolicitacao | '')} opcoes={Object.entries(ROTULO_STATUS_SOLICITACAO).map(([valor, rotulo]) => ({ valor, rotulo }))} />
        </FilterBar>
      </Card>
      <div className="grid-2">
        <Kpi rotulo="Solicitações no filtro" valor={lista.length} />
        <Card titulo="Por prioridade">
          <GraficoBarra dados={porPrioridade} />
        </Card>
      </div>
      <Card titulo="Resultado">
        <Table colunas={colunas} linhas={lista} chaveLinha={(s) => s.id} vazio="Nenhum registro para exportar neste período." />
      </Card>
    </>
  )
}
