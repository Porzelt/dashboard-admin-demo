import { buscar, dentroDoPeriodo, normalizar, ordenar, paginar } from '../domain/consulta'
import { consultarClientes, filtrarSolicitacoes, ordenarSolicitacoes, type FiltroClientes } from '../domain/consultas'
import { gerarClientes, gerarSolicitacoes } from '../data/seed'
import { indicadores, porMes } from '../domain/indicadores'

const clientes = gerarClientes()
const solicitacoes = gerarSolicitacoes(clientes)
const base: FiltroClientes = { busca: '', status: '', cidade: '', ordem: 'nome', direcao: 'asc', pagina: 1, tamanho: 10 }

describe('busca', () => {
  it('ignora acentos e maiúsculas', () => {
    expect(normalizar('  São PAULO ')).toBe('sao paulo')
    const r = buscar([{ n: 'Fábio' }, { n: 'Carla' }], 'fabio', (i) => [i.n])
    expect(r).toEqual([{ n: 'Fábio' }])
  })
  it('termo vazio devolve tudo', () => {
    expect(buscar([1, 2], '', (i) => [String(i)])).toHaveLength(2)
  })
})

describe('ordenação', () => {
  it('ordena texto (pt-BR) e números em ambas as direções, sem mutar', () => {
    const lista = [{ n: 'Édson', v: 3 }, { n: 'Ana', v: 10 }, { n: 'Bia', v: 2 }]
    expect(ordenar(lista, (i) => i.n, 'asc').map((i) => i.n)).toEqual(['Ana', 'Bia', 'Édson'])
    expect(ordenar(lista, (i) => i.v, 'desc').map((i) => i.v)).toEqual([10, 3, 2])
    expect(lista[0].n).toBe('Édson')
  })
})

describe('paginação', () => {
  it('divide e limita a página ao intervalo válido', () => {
    const itens = Array.from({ length: 25 }, (_, i) => i)
    expect(paginar(itens, 1, 10).itens).toHaveLength(10)
    expect(paginar(itens, 3, 10).itens).toHaveLength(5)
    expect(paginar(itens, 99, 10).pagina).toBe(3)
    expect(paginar(itens, 0, 10).pagina).toBe(1)
    expect(paginar([], 1, 10)).toMatchObject({ totalPaginas: 1, total: 0 })
  })
})

describe('consultarClientes', () => {
  it('combina status e cidade', () => {
    const r = consultarClientes(clientes, { ...base, status: 'ativo', tamanho: 100 })
    expect(r.itens.length).toBeGreaterThan(0)
    expect(r.itens.every((c) => c.status === 'ativo')).toBe(true)
    const cidade = r.itens[0].cidade
    const r2 = consultarClientes(clientes, { ...base, status: 'ativo', cidade, tamanho: 100 })
    expect(r2.itens.every((c) => c.cidade === cidade && c.status === 'ativo')).toBe(true)
  })
  it('ordena por receita decrescente', () => {
    const r = consultarClientes(clientes, { ...base, ordem: 'receita', direcao: 'desc', tamanho: 100 })
    const v = r.itens.map((c) => c.receita)
    expect(v).toEqual([...v].sort((a, b) => b - a))
  })
  it('busca por e-mail', () => {
    const alvo = clientes[3]
    expect(consultarClientes(clientes, { ...base, busca: alvo.email }).itens[0].id).toBe(alvo.id)
  })
})

describe('solicitações e período', () => {
  it('filtra por status e por período inclusivo', () => {
    expect(dentroDoPeriodo('2026-03-10', '2026-03-10', '2026-03-10')).toBe(true)
    expect(dentroDoPeriodo('2026-03-09', '2026-03-10')).toBe(false)
    const r = filtrarSolicitacoes(solicitacoes, { status: 'concluida', de: '2026-04-01', ate: '2026-06-30' })
    expect(r.every((s) => s.status === 'concluida' && s.criadaEm >= '2026-04-01' && s.criadaEm <= '2026-06-30')).toBe(true)
  })
})

describe('ordenarSolicitacoes', () => {
  const nome = (id: string) => clientes.find((c) => c.id === id)?.nome ?? ''

  it('status segue o fluxo (aberta → em andamento → concluída), não o alfabeto', () => {
    const r = ordenarSolicitacoes(solicitacoes, 'status', 'asc', nome).map((s) => s.status)
    expect(r.indexOf('em_andamento')).toBeGreaterThan(r.lastIndexOf('aberta'))
    expect(r.indexOf('concluida')).toBeGreaterThan(r.lastIndexOf('em_andamento'))
  })

  it('prioridade decrescente começa pelas altas', () => {
    const r = ordenarSolicitacoes(solicitacoes, 'prioridade', 'desc', nome)
    expect(r[0].prioridade).toBe('alta')
    expect(r[r.length - 1].prioridade).toBe('baixa')
  })

  it('ordena pelo nome do cliente e por data', () => {
    const porCliente = ordenarSolicitacoes(solicitacoes, 'cliente', 'asc', nome).map((s) => nome(s.clienteId))
    expect(porCliente).toEqual([...porCliente].sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })))
    const datas = ordenarSolicitacoes(solicitacoes, 'criadaEm', 'desc', nome).map((s) => s.criadaEm)
    expect(datas).toEqual([...datas].sort().reverse())
  })

  it('código em ordem natural (s2 antes de s10)', () => {
    const r = ordenarSolicitacoes(solicitacoes, 'id', 'asc', nome).map((s) => s.id)
    expect(r.slice(0, 3)).toEqual(['s1', 's2', 's3'])
    expect(r.indexOf('s2')).toBeLessThan(r.indexOf('s10'))
  })
})

describe('indicadores', () => {
  it('calcula totais e taxa de conclusão', () => {
    const k = indicadores(clientes, solicitacoes)
    expect(k.totalClientes).toBe(clientes.length)
    const concl = solicitacoes.filter((s) => s.status === 'concluida').length
    expect(k.taxaConclusao).toBe(Math.round((concl / solicitacoes.length) * 100))
    expect(k.abertas + concl).toBe(solicitacoes.length)
  })
  it('agrupa por mês em ordem', () => {
    const r = porMes([{ d: '2026-02-03' }, { d: '2026-01-31' }, { d: '2026-02-20' }], (i) => i.d)
    expect(r).toEqual([{ mes: '2026-01', total: 1 }, { mes: '2026-02', total: 2 }])
  })
})
