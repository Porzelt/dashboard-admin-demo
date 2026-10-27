import { useMemo } from 'react'
import { Card, Kpi, PageHeader, Vazio } from '../components/ui'
import { COR, GraficoBarra, GraficoLinha, GraficoPizza } from '../components/Chart'
import { contarPor } from '../domain/consultas'
import { indicadores, porMes, rotuloMes } from '../domain/indicadores'
import { moeda, tempoRelativo } from '../domain/formatar'
import { ROTULO_STATUS_SOLICITACAO } from '../domain/types'
import { useDados } from '../state'

const COR_STATUS = { aberta: COR.azul, em_andamento: COR.ambar, concluida: COR.verde }

export function Dashboard() {
  const { clientes, solicitacoes, atividades } = useDados()
  const k = useMemo(() => indicadores(clientes, solicitacoes), [clientes, solicitacoes])
  const receita = useMemo(() => porMes(clientes, (c) => c.criadoEm, (c) => c.receita).map((p) => ({ nome: rotuloMes(p.mes), valor: p.total })), [clientes])
  const novos = useMemo(() => porMes(clientes, (c) => c.criadoEm).map((p) => ({ nome: rotuloMes(p.mes), valor: p.total })), [clientes])
  const status = useMemo(() => {
    const c = contarPor(solicitacoes, (s) => s.status)
    return (Object.keys(ROTULO_STATUS_SOLICITACAO) as (keyof typeof ROTULO_STATUS_SOLICITACAO)[]).map((s) => ({ nome: ROTULO_STATUS_SOLICITACAO[s], valor: c[s] ?? 0, cor: COR_STATUS[s] }))
  }, [solicitacoes])

  return (
    <>
      <PageHeader titulo="Dashboard" subtitulo="Visão geral da operação" />
      <div className="grid-kpi">
        <Kpi rotulo="Clientes" valor={k.totalClientes} detalhe={`${k.clientesAtivos} ativos`} />
        <Kpi rotulo="Receita acumulada" valor={moeda(k.receitaTotal)} />
        <Kpi rotulo="Solicitações em aberto" valor={k.abertas} />
        <Kpi rotulo="Taxa de conclusão" valor={`${k.taxaConclusao}%`} />
      </div>
      <div className="grid-2">
        <Card titulo="Receita por mês de cadastro">
          <GraficoLinha dados={receita} formato={(v) => `${Math.round(v / 1000)}k`} />
        </Card>
        <Card titulo="Novos clientes por mês">
          <GraficoBarra dados={novos} />
        </Card>
        <Card titulo="Solicitações por status">
          <GraficoPizza dados={status} />
        </Card>
        <Card titulo="Atividade recente">
          {atividades.length === 0 ? (
            <Vazio texto="Sem atividade." />
          ) : (
            <ul className="atividades">
              {atividades.map((a) => (
                <li key={a.id}>
                  <span>{a.texto}</span>
                  <time className="muted" dateTime={a.em}>
                    {tempoRelativo(a.em, new Date('2026-10-27T09:30:00'))}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  )
}
