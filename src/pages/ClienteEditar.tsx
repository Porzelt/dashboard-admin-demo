import { useState } from 'react'
import { Card, PageHeader, Vazio } from '../components/ui'
import { ClienteForm } from '../components/ClienteForm'
import { ir } from '../rota'
import { useDados } from '../state'

/** id === undefined → cadastro; caso contrário, edição. */
export function ClienteEditar({ id }: { id?: string }) {
  const { clientes, salvarCliente, excluirCliente } = useDados()
  const [salvo, setSalvo] = useState(false)
  const cliente = id ? clientes.find((c) => c.id === id) : undefined

  if (id && !cliente) return <Vazio texto="Cliente não encontrado." />

  return (
    <>
      <PageHeader
        titulo={cliente ? 'Editar cliente' : 'Novo cliente'}
        subtitulo={cliente?.nome}
        acoes={
          cliente && (
            <button
              type="button"
              className="btn btn-perigo"
              onClick={async () => {
                if (window.confirm(`Excluir ${cliente.nome}?`)) {
                  await excluirCliente(cliente.id)
                  ir('/clientes')
                }
              }}
            >
              Excluir
            </button>
          )
        }
      />
      <Card className="card-form">
        {salvo && (
          <p className="aviso-ok" role="status">
            Cliente salvo com sucesso.
          </p>
        )}
        <ClienteForm
          inicial={cliente && { nome: cliente.nome, email: cliente.email, telefone: cliente.telefone, empresa: cliente.empresa, cidade: cliente.cidade, status: cliente.status }}
          onCancelar={() => ir('/clientes')}
          onSubmit={async (v) => {
            await salvarCliente(v, id)
            setSalvo(true)
            setTimeout(() => ir('/clientes'), 700)
          }}
        />
      </Card>
    </>
  )
}
