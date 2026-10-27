import { useEffect, useState, type ReactNode } from 'react'

export const ITENS_MENU = [
  { rota: 'dashboard', rotulo: 'Dashboard', icone: '▦' },
  { rota: 'clientes', rotulo: 'Clientes', icone: '☺' },
  { rota: 'solicitacoes', rotulo: 'Solicitações', icone: '✉' },
  { rota: 'relatorios', rotulo: 'Relatórios', icone: '≣' },
]

type Tema = 'claro' | 'escuro'

function temaInicial(): Tema {
  try {
    const salvo = localStorage.getItem('tema')
    if (salvo === 'claro' || salvo === 'escuro') return salvo
  } catch {
    /* sem storage */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'
}

export function Layout({ atual, children }: { atual: string; children: ReactNode }) {
  const [recolhido, setRecolhido] = useState(false)
  const [aberto, setAberto] = useState(false) // gaveta no mobile
  const [tema, setTema] = useState<Tema>(temaInicial)

  useEffect(() => {
    document.documentElement.dataset.tema = tema
    try {
      localStorage.setItem('tema', tema)
    } catch {
      /* sem storage */
    }
  }, [tema])

  return (
    <div className={`app ${recolhido ? 'recolhido' : ''} ${aberto ? 'aberto' : ''}`}>
      <aside className="sidebar" aria-label="Menu principal">
        <div className="marca">
          <span className="logo" aria-hidden>
            ◆
          </span>
          <span className="marca-texto">Painel Demo</span>
        </div>
        <nav>
          {ITENS_MENU.map((i) => (
            <a key={i.rota} href={`#/${i.rota}`} className={atual === i.rota ? 'ativo' : ''} aria-current={atual === i.rota ? 'page' : undefined} onClick={() => setAberto(false)} title={i.rotulo}>
              <span className="icone" aria-hidden>
                {i.icone}
              </span>
              <span className="rotulo">{i.rotulo}</span>
            </a>
          ))}
        </nav>
        <button type="button" className="btn btn-ghost recolher" onClick={() => setRecolhido((r) => !r)} aria-label={recolhido ? 'Expandir menu' : 'Recolher menu'}>
          {recolhido ? '»' : '« Recolher'}
        </button>
      </aside>
      {aberto && <div className="escuro-fundo" onClick={() => setAberto(false)} />}
      <div className="conteudo">
        <header className="topbar">
          <button type="button" className="btn menu-mobile" onClick={() => setAberto(true)} aria-label="Abrir menu">
            ☰
          </button>
          <span className="muted topo-texto">Dados fictícios para demonstração</span>
          <button type="button" className="btn" onClick={() => setTema((t) => (t === 'claro' ? 'escuro' : 'claro'))} aria-label="Alternar tema">
            {tema === 'claro' ? '☾ Escuro' : '☀ Claro'}
          </button>
        </header>
        <main>{children}</main>
      </div>
    </div>
  )
}
