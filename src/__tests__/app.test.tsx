import type { ReactNode } from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClienteForm } from '../components/ClienteForm'
import { Clientes } from '../pages/Clientes'
import { Solicitacoes } from '../pages/Solicitacoes'
import { MockRepository } from '../data/MockRepository'
import { DadosProvider } from '../state'

function comDados(ui: ReactNode) {
  return render(<DadosProvider repo={new MockRepository()}>{ui}</DadosProvider>)
}

describe('ClienteForm', () => {
  it('mostra erros e não envia quando inválido', async () => {
    const onSubmit = vi.fn()
    render(<ClienteForm onSubmit={onSubmit} onCancelar={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(await screen.findByText('E-mail inválido')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })
  it('envia quando válido', async () => {
    const onSubmit = vi.fn()
    render(<ClienteForm onSubmit={onSubmit} onCancelar={() => {}} />)
    await userEvent.type(screen.getByLabelText('Nome'), 'Maria Souza')
    await userEvent.type(screen.getByLabelText('E-mail'), 'maria@exemplo.com.br')
    await userEvent.type(screen.getByLabelText('Telefone'), '11912345678')
    await userEvent.type(screen.getByLabelText('Empresa'), 'Alfa')
    await userEvent.type(screen.getByLabelText('Cidade'), 'Recife')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce())
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ nome: 'Maria Souza', status: 'ativo' })
  })
})

describe('tela Clientes', () => {
  it('busca sem resultado mostra mensagem vazia', async () => {
    comDados(<Clientes />)
    await screen.findByText('48 registros')
    await userEvent.type(screen.getByLabelText('Buscar'), 'zzzzinexistente')
    expect(await screen.findByText(/Nenhum cliente encontrado/)).toBeInTheDocument()
  })
  it('pagina', async () => {
    comDados(<Clientes />)
    await screen.findByText('Página 1 de 5')
    await userEvent.click(screen.getByRole('button', { name: 'Próxima' }))
    expect(screen.getByText('Página 2 de 5')).toBeInTheDocument()
  })
})

describe('tela Solicitações', () => {
  it('filtra por status pelas abas e abre o detalhe', async () => {
    comDados(<Solicitacoes />)
    const aba = await screen.findByRole('tab', { name: /Concluída/ })
    await userEvent.click(aba)
    const tabela = screen.getByRole('table')
    expect(within(tabela).queryByText('Aberta', { selector: '.badge' })).toBeNull()
    const badges = within(tabela).getAllByText('Concluída', { selector: '.badge' })
    await userEvent.click(badges[0])
    expect(await screen.findByText(/^Solicitação #s\d+$/)).toBeInTheDocument()
  })
})
