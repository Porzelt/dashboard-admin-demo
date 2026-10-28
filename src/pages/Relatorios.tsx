import { useMemo, useState } from 'react'
import { Card, Kpi, PageHeader } from '../components/ui'
import { CampoData, FilterBar, Selecao } from '../components/FilterBar'
import { Table, type Coluna } from '../components/Table'
import { StatusSolBadge } from '../components/badges'
import { COR, GraficoBarra } from '../components/Chart'
import { baixarCsv, gerarCsv, type ColunaCsv } from '../domain/csv'
import { baixarExcel, dataExcel, type ColunaPlanilha } from '../domain/planilha'
import { useOrdenacao } from '../components/useOrdenacao'
import { filtrarSolicitacoes, ordenarSolicitacoes, type CampoSolicitacao } from '../domain/consultas'
import { dataBr } from '../domain/formatar'
import { ROTULO_PRIORIDADE, ROTULO_STATUS_SOLICITACAO, type Solicitacao, type StatusSolicitacao } from '../domain/types'
import { useDados } from '../state'

const COR_PRIORIDADE = { alta: COR.vermelho, media: COR.ambar, baixa: COR.cinza }

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

export function colunasPlanilha(nomeCliente: (id: string) => string): ColunaPlanilha<Solicitacao>[] {
  return [
    { titulo: 'Código', valor: (s) => s.id, largura: 10 },
    { titulo: 'Assunto', valor: (s) => s.titulo, largura: 34 },
    { titulo: 'Cliente', valor: (s) => nomeCliente(s.clienteId), largura: 24 },
    { titulo: 'Status', valor: (s) => ROTULO_STATUS_SOLICITACAO[s.status], largura: 16 },
    { titulo: 'Prioridade', valor: (s) => ROTULO_PRIORIDADE[s.prioridade] },
    { titulo: 'Aberta em', valor: (s) => dataExcel(s.criadaEm) },
    { titulo: 'Atualizada em', valor: (s) => dataExcel(s.atualizadaEm), largura: 15 },
  ]
}

// data local (yyyy-mm-dd) para o nome do arquivo; toISOString usaria UTC e viraria o dia à noite
const hoje = () => new Date().toLocaleDateString('sv-SE')

export function Relatorios() {
  const { solicitacoes, clientes } = useDados()
  const [status, setStatus] = useState<StatusSolicitacao | ''>('')
  const [de, setDe] = useState('')
  const [ate, setAte] = useState('')
  const [gerando, setGerando] = useState(false)
  const { ordem, direcao, alternar } = useOrdenacao<CampoSolicitacao>('criadaEm', 'desc')
  const nomeCliente = (id: string) => clientes.find((c) => c.id === id)?.nome ?? '—'
  // a exportação (Excel/CSV) sai na mesma ordem da tela
  const lista = useMemo(() => {
    const nome = (id: string) => clientes.find((c) => c.id === id)?.nome ?? ''
    return ordenarSolicitacoes(filtrarSolicitacoes(solicitacoes, { status, de, ate }), ordem, direcao, nome)
  }, [solicitacoes, clientes, status, de, ate, ordem, direcao])
  const porPrioridade = (['alta', 'media', 'baixa'] as const).map((p) => ({ nome: ROTULO_PRIORIDADE[p], valor: lista.filter((s) => s.prioridade === p).length, cor: COR_PRIORIDADE[p] }))

  const colunas: Coluna<Solicitacao>[] = [
    { chave: 'id', titulo: 'Código', ordenavel: true, render: (s) => s.id },
    { chave: 'titulo', titulo: 'Assunto', ordenavel: true, render: (s) => s.titulo },
    { chave: 'cliente', titulo: 'Cliente', ordenavel: true, render: (s) => nomeCliente(s.clienteId) },
    { chave: 'status', titulo: 'Status', ordenavel: true, render: (s) => <StatusSolBadge s={s.status} /> },
    { chave: 'criadaEm', titulo: 'Aberta em', ordenavel: true, render: (s) => dataBr(s.criadaEm) },
  ]

  return (
    <>
      <PageHeader
        titulo="Relatórios"
        subtitulo="Filtre por período e status, exporte para Excel ou CSV, ou imprima"
        acoes={
          <>
            <button
              type="button"
              className="btn btn-primario"
              disabled={lista.length === 0 || gerando}
              onClick={async () => {
                setGerando(true)
                try {
                  await baixarExcel(`solicitacoes-${hoje()}.xlsx`, lista, colunasPlanilha(nomeCliente), 'Solicitações')
                } finally {
                  setGerando(false)
                }
              }}
            >
              {gerando ? 'Gerando…' : 'Exportar Excel'}
            </button>
            <button type="button" className="btn" disabled={lista.length === 0} onClick={() => baixarCsv(`solicitacoes-${hoje()}.csv`, gerarCsv(lista, colunasCsv(nomeCliente)))}>
              CSV
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
      <div className="grid-2 alinhado-topo">
        <Kpi rotulo="Solicitações no filtro" valor={lista.length} />
        <Card titulo="Por prioridade">
          <GraficoBarra dados={porPrioridade} nome="Solicitações" />
        </Card>
      </div>
      <Card titulo="Resultado">
        <Table colunas={colunas} linhas={lista} chaveLinha={(s) => s.id} ordem={ordem} direcao={direcao} onOrdenar={alternar} vazio="Nenhum registro para exportar neste período." />
      </Card>
    </>
  )
}
