import type { Atividade, Cliente, NovoCliente, Solicitacao, StatusSolicitacao } from '../domain/types'

/** Contrato da camada de dados. Para usar uma API real, implemente esta interface (ex.: ApiRepository com fetch). */
export interface Repository {
  listarClientes(): Promise<Cliente[]>
  obterCliente(id: string): Promise<Cliente | undefined>
  salvarCliente(dados: NovoCliente, id?: string): Promise<Cliente>
  excluirCliente(id: string): Promise<void>
  listarSolicitacoes(): Promise<Solicitacao[]>
  atualizarStatus(id: string, status: StatusSolicitacao): Promise<Solicitacao>
  listarAtividades(): Promise<Atividade[]>
}
