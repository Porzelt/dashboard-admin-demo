import { z } from 'zod'

const soDigitos = (s: string) => s.replace(/\D/g, '')

export const clienteSchema = z.object({
  nome: z.string().trim().min(3, 'Informe o nome (mín. 3 letras)').max(80, 'Máximo de 80 caracteres'),
  email: z.string().trim().email('E-mail inválido'),
  telefone: z
    .string()
    .trim()
    .refine((v) => [10, 11].includes(soDigitos(v).length), 'Telefone com DDD (10 ou 11 dígitos)'),
  empresa: z.string().trim().min(2, 'Informe a empresa'),
  cidade: z.string().trim().min(2, 'Informe a cidade'),
  status: z.enum(['ativo', 'inativo', 'pendente']),
})

export type ClienteForm = z.infer<typeof clienteSchema>
