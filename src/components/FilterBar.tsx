import type { ReactNode } from 'react'

export interface Opcao {
  valor: string
  rotulo: string
}

export function FilterBar({ children, onLimpar }: { children: ReactNode; onLimpar?: () => void }) {
  return (
    <div className="filterbar" role="search">
      {children}
      {onLimpar && (
        <button type="button" className="btn btn-ghost" onClick={onLimpar}>
          Limpar filtros
        </button>
      )}
    </div>
  )
}

export function CampoBusca({ valor, onChange, placeholder = 'Buscar…' }: { valor: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input className="input busca" type="search" aria-label="Buscar" placeholder={placeholder} value={valor} onChange={(e) => onChange(e.target.value)} />
}

export function Selecao({ rotulo, valor, opcoes, onChange, todos = 'Todos' }: { rotulo: string; valor: string; opcoes: Opcao[]; onChange: (v: string) => void; todos?: string }) {
  return (
    <label className="campo-inline">
      <span>{rotulo}</span>
      <select className="input" value={valor} onChange={(e) => onChange(e.target.value)}>
        <option value="">{todos}</option>
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
    </label>
  )
}

export function CampoData({ rotulo, valor, onChange }: { rotulo: string; valor: string; onChange: (v: string) => void }) {
  return (
    <label className="campo-inline">
      <span>{rotulo}</span>
      <input className="input" type="date" value={valor} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}
