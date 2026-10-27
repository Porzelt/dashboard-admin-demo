import type { ReactNode } from 'react'
import type { Direcao } from '../domain/consulta'

export interface Coluna<T> {
  chave: string
  titulo: string
  render: (item: T) => ReactNode
  ordenavel?: boolean
  /** Rótulo exibido no card em telas pequenas (padrão: título). */
  oculta?: boolean
}

interface Props<T> {
  colunas: Coluna<T>[]
  linhas: T[]
  chaveLinha: (item: T) => string
  ordem?: string
  direcao?: Direcao
  onOrdenar?: (chave: string) => void
  onLinha?: (item: T) => void
  vazio?: string
}

/** Tabela genérica; em telas estreitas cada linha vira um cartão (CSS) usando data-label. */
export function Table<T>({ colunas, linhas, chaveLinha, ordem, direcao, onOrdenar, onLinha, vazio = 'Nenhum resultado.' }: Props<T>) {
  if (linhas.length === 0) return <p className="vazio">{vazio}</p>
  return (
    <div className="tabela-wrap">
      <table className="tabela">
        <thead>
          <tr>
            {colunas.map((c) => (
              <th key={c.chave} aria-sort={ordem === c.chave ? (direcao === 'asc' ? 'ascending' : 'descending') : undefined}>
                {c.ordenavel && onOrdenar ? (
                  <button type="button" className="th-btn" onClick={() => onOrdenar(c.chave)}>
                    {c.titulo}
                    <span aria-hidden>{ordem === c.chave ? (direcao === 'asc' ? ' ▲' : ' ▼') : ''}</span>
                  </button>
                ) : (
                  c.titulo
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((l) => (
            <tr key={chaveLinha(l)} className={onLinha ? 'clicavel' : undefined} onClick={onLinha ? () => onLinha(l) : undefined}>
              {colunas.map((c) => (
                <td key={c.chave} data-label={c.titulo}>
                  <div className="cel">{c.render(l)}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Paginacao({ pagina, totalPaginas, total, onPagina }: { pagina: number; totalPaginas: number; total: number; onPagina: (p: number) => void }) {
  return (
    <nav className="paginacao" aria-label="Paginação">
      <span className="muted">
        {total} {total === 1 ? 'registro' : 'registros'}
      </span>
      <div className="acoes">
        <button type="button" className="btn" disabled={pagina <= 1} onClick={() => onPagina(pagina - 1)}>
          Anterior
        </button>
        <span aria-live="polite">
          Página {pagina} de {totalPaginas}
        </span>
        <button type="button" className="btn" disabled={pagina >= totalPaginas} onClick={() => onPagina(pagina + 1)}>
          Próxima
        </button>
      </div>
    </nav>
  )
}
