// Regras puras de busca, filtro, ordenação e paginação (sem dependência de UI).
export type Direcao = 'asc' | 'desc'

export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

export function buscar<T>(itens: T[], termo: string, campos: (item: T) => string[]): T[] {
  const t = normalizar(termo)
  if (!t) return itens
  return itens.filter((i) => campos(i).some((c) => normalizar(c).includes(t)))
}

export function ordenar<T>(itens: T[], valor: (item: T) => string | number, direcao: Direcao): T[] {
  const sinal = direcao === 'asc' ? 1 : -1
  return [...itens].sort((a, b) => {
    const va = valor(a)
    const vb = valor(b)
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * sinal
    return String(va).localeCompare(String(vb), 'pt-BR', { sensitivity: 'base' }) * sinal
  })
}

export interface Pagina<T> {
  itens: T[]
  pagina: number
  totalPaginas: number
  total: number
}

export function paginar<T>(itens: T[], pagina: number, tamanho: number): Pagina<T> {
  const totalPaginas = Math.max(1, Math.ceil(itens.length / tamanho))
  const atual = Math.min(Math.max(1, pagina), totalPaginas)
  const inicio = (atual - 1) * tamanho
  return { itens: itens.slice(inicio, inicio + tamanho), pagina: atual, totalPaginas, total: itens.length }
}

export function dentroDoPeriodo(dataIso: string, de?: string, ate?: string): boolean {
  const d = dataIso.slice(0, 10)
  if (de && d < de) return false
  if (ate && d > ate) return false
  return true
}
