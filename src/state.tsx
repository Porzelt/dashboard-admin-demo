import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Repository } from './data/Repository'
import type { Atividade, Cliente, NovoCliente, Solicitacao, StatusSolicitacao } from './domain/types'

interface Dados {
  carregando: boolean
  clientes: Cliente[]
  solicitacoes: Solicitacao[]
  atividades: Atividade[]
  salvarCliente(dados: NovoCliente, id?: string): Promise<Cliente>
  excluirCliente(id: string): Promise<void>
  atualizarStatus(id: string, status: StatusSolicitacao): Promise<void>
}

const Ctx = createContext<Dados | null>(null)

export function DadosProvider({ repo, children }: { repo: Repository; children: ReactNode }) {
  const [carregando, setCarregando] = useState(true)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([])
  const [atividades, setAtividades] = useState<Atividade[]>([])

  const recarregar = useCallback(async () => {
    const [c, s, a] = await Promise.all([repo.listarClientes(), repo.listarSolicitacoes(), repo.listarAtividades()])
    setClientes(c)
    setSolicitacoes(s)
    setAtividades(a)
  }, [repo])

  useEffect(() => {
    recarregar().finally(() => setCarregando(false))
  }, [recarregar])

  const valor = useMemo<Dados>(
    () => ({
      carregando,
      clientes,
      solicitacoes,
      atividades,
      async salvarCliente(dados, id) {
        const c = await repo.salvarCliente(dados, id)
        await recarregar()
        return c
      },
      async excluirCliente(id) {
        await repo.excluirCliente(id)
        await recarregar()
      },
      async atualizarStatus(id, status) {
        await repo.atualizarStatus(id, status)
        await recarregar()
      },
    }),
    [carregando, clientes, solicitacoes, atividades, repo, recarregar],
  )

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useDados(): Dados {
  const v = useContext(Ctx)
  if (!v) throw new Error('useDados fora do DadosProvider')
  return v
}
