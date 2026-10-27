import { clienteSchema } from '../domain/validacao'

const ok = { nome: 'Ana Almeida', email: 'ana@exemplo.com.br', telefone: '(11) 91234-5678', empresa: 'Alfa', cidade: 'Campinas', status: 'ativo' as const }

describe('clienteSchema', () => {
  it('aceita dados válidos (telefone com 10 ou 11 dígitos)', () => {
    expect(clienteSchema.safeParse(ok).success).toBe(true)
    expect(clienteSchema.safeParse({ ...ok, telefone: '1132345678' }).success).toBe(true)
  })
  it.each([
    ['nome', 'Al'],
    ['email', 'sem-arroba'],
    ['telefone', '12345'],
    ['empresa', ''],
    ['cidade', ' '],
    ['status', 'qualquer'],
  ])('rejeita %s inválido', (campo, valor) => {
    const r = clienteSchema.safeParse({ ...ok, [campo]: valor })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0].path[0]).toBe(campo)
  })
})
