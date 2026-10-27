import type { Atividade, Cliente, NovoCliente, Solicitacao, StatusSolicitacao } from '../domain/types'
import type { Repository } from './Repository'
import { gerarAtividades, gerarClientes, gerarSolicitacoes } from './seed'

const atraso = (ms: number) => (ms > 0 ? new Promise<void>((r) => setTimeout(r, ms)) : Promise.resolve())

/** Implementação em memória (dados 100% fictícios). `latencia` simula a rede. */
export class MockRepository implements Repository {
  private clientes: Cliente[]
  private solicitacoes: Solicitacao[]
  private atividades: Atividade[]

  constructor(private latencia = 0) {
    this.clientes = gerarClientes()
    this.solicitacoes = gerarSolicitacoes(this.clientes)
    this.atividades = gerarAtividades()
  }

  async listarClientes() {
    await atraso(this.latencia)
    return [...this.clientes]
  }

  async obterCliente(id: string) {
    await atraso(this.latencia)
    return this.clientes.find((c) => c.id === id)
  }

  async salvarCliente(dados: NovoCliente, id?: string) {
    await atraso(this.latencia)
    const existente = id ? this.clientes.find((c) => c.id === id) : undefined
    if (existente) {
      const atualizado = { ...existente, ...dados }
      this.clientes = this.clientes.map((c) => (c.id === id ? atualizado : c))
      this.log(`Cliente ${atualizado.nome} atualizado`)
      return atualizado
    }
    const novo: Cliente = {
      ...dados,
      id: `c${Date.now()}`,
      criadoEm: new Date().toISOString().slice(0, 10),
      receita: 0,
    }
    this.clientes = [novo, ...this.clientes]
    this.log(`Novo cliente cadastrado: ${novo.nome}`)
    return novo
  }

  async excluirCliente(id: string) {
    await atraso(this.latencia)
    this.clientes = this.clientes.filter((c) => c.id !== id)
  }

  async listarSolicitacoes() {
    await atraso(this.latencia)
    return [...this.solicitacoes]
  }

  async atualizarStatus(id: string, status: StatusSolicitacao) {
    await atraso(this.latencia)
    const atual = this.solicitacoes.find((s) => s.id === id)
    if (!atual) throw new Error('Solicitação não encontrada')
    const atualizada = { ...atual, status, atualizadaEm: new Date().toISOString().slice(0, 10) }
    this.solicitacoes = this.solicitacoes.map((s) => (s.id === id ? atualizada : s))
    this.log(`Solicitação #${id} atualizada`)
    return atualizada
  }

  async listarAtividades() {
    await atraso(this.latencia)
    return [...this.atividades]
  }

  private log(texto: string) {
    this.atividades = [{ id: `a${Date.now()}`, texto, em: new Date().toISOString() }, ...this.atividades].slice(0, 8)
  }
}
