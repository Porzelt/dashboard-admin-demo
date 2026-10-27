import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Clientes } from './pages/Clientes'
import { ClienteEditar } from './pages/ClienteEditar'
import { Solicitacoes } from './pages/Solicitacoes'
import { Relatorios } from './pages/Relatorios'
import { useRota } from './rota'
import { useDados } from './state'

export function App() {
  const [secao = 'dashboard', sub] = useRota()
  const { carregando } = useDados()

  let tela
  if (carregando) tela = <p className="vazio">Carregando…</p>
  else if (secao === 'clientes' && sub === 'novo') tela = <ClienteEditar key="novo" />
  else if (secao === 'clientes' && sub) tela = <ClienteEditar key={sub} id={sub} />
  else if (secao === 'clientes') tela = <Clientes />
  else if (secao === 'solicitacoes') tela = <Solicitacoes />
  else if (secao === 'relatorios') tela = <Relatorios />
  else tela = <Dashboard />

  return <Layout atual={secao}>{tela}</Layout>
}
