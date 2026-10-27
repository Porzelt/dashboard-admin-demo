export interface ColunaCsv<T> {
  titulo: string
  valor: (item: T) => string | number
}

function escapar(v: string | number): string {
  let s = String(v)
  // evita injeção de fórmula ao abrir no Excel/Sheets
  if (/^[=+\-@]/.test(s) && typeof v === 'string') s = `'${s}`
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** CSV com ';' (padrão do Excel pt-BR) e BOM para acentuação correta. */
export function gerarCsv<T>(itens: T[], colunas: ColunaCsv<T>[]): string {
  const linhas = [colunas.map((c) => escapar(c.titulo)).join(';')]
  for (const i of itens) linhas.push(colunas.map((c) => escapar(c.valor(i))).join(';'))
  return '﻿' + linhas.join('\r\n')
}

export function baixarCsv(nome: string, conteudo: string): void {
  const url = URL.createObjectURL(new Blob([conteudo], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = nome
  a.click()
  URL.revokeObjectURL(url)
}
