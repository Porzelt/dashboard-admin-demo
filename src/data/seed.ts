import type { Atividade, Cliente, Prioridade, Solicitacao, StatusCliente, StatusSolicitacao } from '../domain/types'

// PRNG determinístico: os mesmos dados fictícios em toda execução (e nos testes).
function prng(semente: number) {
  let s = semente
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

const NOMES = ['Ana', 'Bruno', 'Carla', 'Daniel', 'Elisa', 'Fábio', 'Gabriela', 'Hugo', 'Isabela', 'João', 'Karina', 'Lucas', 'Marina', 'Nelson', 'Olívia', 'Paulo', 'Renata', 'Sérgio', 'Tatiana', 'Vítor']
const SOBRENOMES = ['Almeida', 'Barros', 'Cardoso', 'Dias', 'Esteves', 'Ferraz', 'Gomes', 'Holanda', 'Lopes', 'Moraes', 'Nogueira', 'Pacheco', 'Ramos', 'Siqueira', 'Teixeira']
const EMPRESAS = ['Alfa Comércio', 'Beta Serviços', 'Cedro Tecnologia', 'Delta Logística', 'Estrela Alimentos', 'Faro Consultoria', 'Girassol Moda', 'Horizonte Saúde', 'Ipê Educação', 'Jacarandá Móveis']
const CIDADES = ['São Paulo', 'Campinas', 'Curitiba', 'Belo Horizonte', 'Porto Alegre', 'Recife', 'Salvador', 'Goiânia']
const ASSUNTOS = ['Erro ao emitir relatório', 'Dúvida sobre fatura', 'Solicitação de novo usuário', 'Lentidão no painel', 'Ajuste de permissões', 'Importação de planilha', 'Integração com sistema externo', 'Atualização de cadastro', 'Pedido de treinamento', 'Falha no envio de e-mail']

function pick<T>(r: () => number, lista: T[]): T {
  return lista[Math.floor(r() * lista.length)]
}
const pad = (n: number) => String(n).padStart(2, '0')
const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '')

/** Data yyyy-mm-dd entre 01/01/2026 e 27/10/2026. */
function data(r: () => number): string {
  const dia = Math.floor(r() * 300)
  const d = new Date(Date.UTC(2026, 0, 1 + dia))
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
}

export function gerarClientes(qtd = 48): Cliente[] {
  const r = prng(42)
  return Array.from({ length: qtd }, (_, i) => {
    const nome = pick(r, NOMES)
    const sobrenome = pick(r, SOBRENOMES)
    const sorteio = r()
    const status: StatusCliente = sorteio < 0.65 ? 'ativo' : sorteio < 0.85 ? 'pendente' : 'inativo'
    return {
      id: `c${i + 1}`,
      nome: `${nome} ${sobrenome}`,
      email: `${slug(nome)}.${slug(sobrenome)}${i + 1}@exemplo.com.br`,
      telefone: `(${pick(r, ['11', '19', '41', '31', '51', '81'])}) 9${Math.floor(1000 + r() * 8999)}-${Math.floor(1000 + r() * 8999)}`,
      empresa: pick(r, EMPRESAS),
      cidade: pick(r, CIDADES),
      status,
      criadoEm: data(r),
      receita: Math.round((2000 + r() * 48000) / 100) * 100,
    }
  })
}

export function gerarSolicitacoes(clientes: Cliente[], qtd = 36): Solicitacao[] {
  const r = prng(7)
  return Array.from({ length: qtd }, (_, i) => {
    const s = r()
    const status: StatusSolicitacao = s < 0.3 ? 'aberta' : s < 0.6 ? 'em_andamento' : 'concluida'
    const p = r()
    const prioridade: Prioridade = p < 0.3 ? 'alta' : p < 0.7 ? 'media' : 'baixa'
    const criada = data(r)
    const cliente = pick(r, clientes)
    return {
      id: `s${i + 1}`,
      titulo: pick(r, ASSUNTOS),
      descricao: `Solicitação aberta por ${cliente.nome} (${cliente.empresa}). Texto fictício de exemplo para demonstração do detalhe.`,
      clienteId: cliente.id,
      status,
      prioridade,
      criadaEm: criada,
      atualizadaEm: criada,
    }
  })
}

export function gerarAtividades(): Atividade[] {
  const base = new Date('2026-10-27T09:00:00')
  const textos = [
    'Nova solicitação registrada por Ana Almeida',
    'Cliente Bruno Cardoso atualizado',
    'Solicitação #s12 marcada como concluída',
    'Novo cliente cadastrado: Carla Dias',
    'Relatório mensal exportado',
    'Solicitação #s3 passou para em andamento',
  ]
  return textos.map((texto, i) => ({
    id: `a${i + 1}`,
    texto,
    em: new Date(base.getTime() - (i * 47 + 5) * 60000).toISOString(),
  }))
}
