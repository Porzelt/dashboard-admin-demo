import type { ReactNode } from 'react'

export function Card({ titulo, acao, children, className = '' }: { titulo?: string; acao?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`card ${className}`}>
      {(titulo || acao) && (
        <header className="card-head">
          {titulo && <h2>{titulo}</h2>}
          {acao}
        </header>
      )}
      {children}
    </section>
  )
}

export function Kpi({ rotulo, valor, detalhe }: { rotulo: string; valor: string | number; detalhe?: string }) {
  return (
    <div className="card kpi">
      <span className="kpi-rotulo">{rotulo}</span>
      <strong className="kpi-valor">{valor}</strong>
      {detalhe && <span className="kpi-detalhe">{detalhe}</span>}
    </div>
  )
}

export function Badge({ tom, children }: { tom: 'verde' | 'amarelo' | 'vermelho' | 'azul' | 'cinza'; children: ReactNode }) {
  return <span className={`badge badge-${tom}`}>{children}</span>
}

export function Vazio({ texto }: { texto: string }) {
  return <p className="vazio">{texto}</p>
}

export function PageHeader({ titulo, subtitulo, acoes }: { titulo: string; subtitulo?: string; acoes?: ReactNode }) {
  return (
    <div className="page-header">
      <div>
        <h1>{titulo}</h1>
        {subtitulo && <p className="muted">{subtitulo}</p>}
      </div>
      {acoes && <div className="acoes">{acoes}</div>}
    </div>
  )
}
