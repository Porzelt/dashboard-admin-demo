import { useMemo, useState } from 'react'
import { Card, PageHeader } from '../components/ui'
import { CampoBusca, FilterBar, Selecao } from '../components/FilterBar'
import { Paginacao, Table, type Coluna } from '../components/Table'
import { StatusClienteBadge } from '../components/badges'
import { consultarClientes, type CampoCliente, type FiltroClientes } from '../domain/consultas'
import { dataBr, moeda } from '../domain/formatar'
import { ROTULO_STATUS_CLIENTE, type Cliente, type StatusCliente } from '../domain/types'
import { ir } from '../rota'
import { useDados } from '../state'

const INICIAL: FiltroClientes = { busca: '', status: '', cidade: '', ordem: 'nome', direcao: 'asc', pagina: 1, tamanho: 10 }

const COLUNAS: Coluna<Cliente>[] = [
  { chave: 'nome', titulo: 'Nome', ordenavel: true, render: (c) => <><strong>{c.nome}</strong><div className="muted">{c.email}</div></> },
  { chave: 'empresa', titulo: 'Empresa', ordenavel: true, render: (c) => c.empresa },
  { chave: 'cidade', titulo: 'Cidade', ordenavel: true, render: (c) => c.cidade },
  { chave: 'status', titulo: 'Status', ordenavel: true, render: (c) => <StatusClienteBadge s={c.status} /> },
  { chave: 'criadoEm', titulo: 'Cadastro', ordenavel: true, render: (c) => dataBr(c.criadoEm) },
  { chave: 'receita', titulo: 'Receita', ordenavel: true, render: (c) => moeda(c.receita) },
]

export function Clientes() {
  const { clientes } = useDados()
  const [f, setF] = useState<FiltroClientes>(INICIAL)
  const cidades = useMemo(() => [...new Set(clientes.map((c) => c.cidade))].sort().map((c) => ({ valor: c, rotulo: c })), [clientes])
  const resultado = useMemo(() => consultarClientes(clientes, f), [clientes, f])
  const mudar = (p: Partial<FiltroClientes>) => setF((a) => ({ ...a, pagina: 1, ...p }))

  return (
    <>
      <PageHeader
        titulo="Clientes"
        subtitulo="Busque, filtre e ordene"
        acoes={
          <button type="button" className="btn btn-primario" onClick={() => ir('/clientes/novo')}>
            + Novo cliente
          </button>
        }
      />
      <Card>
        <FilterBar onLimpar={() => setF(INICIAL)}>
          <CampoBusca valor={f.busca} onChange={(busca) => mudar({ busca })} placeholder="Buscar por nome, e-mail ou empresa" />
          <Selecao rotulo="Status" valor={f.status} onChange={(v) => mudar({ status: v as StatusCliente | '' })} opcoes={Object.entries(ROTULO_STATUS_CLIENTE).map(([valor, rotulo]) => ({ valor, rotulo }))} />
          <Selecao rotulo="Cidade" valor={f.cidade} onChange={(cidade) => mudar({ cidade })} opcoes={cidades} />
        </FilterBar>
        <Table
          colunas={COLUNAS}
          linhas={resultado.itens}
          chaveLinha={(c) => c.id}
          ordem={f.ordem}
          direcao={f.direcao}
          onOrdenar={(chave) => mudar({ ordem: chave as CampoCliente, direcao: f.ordem === chave && f.direcao === 'asc' ? 'desc' : 'asc' })}
          onLinha={(c) => ir(`/clientes/${c.id}`)}
          vazio="Nenhum cliente encontrado com esses filtros."
        />
        <Paginacao pagina={resultado.pagina} totalPaginas={resultado.totalPaginas} total={resultado.total} onPagina={(pagina) => setF((a) => ({ ...a, pagina }))} />
      </Card>
    </>
  )
}
