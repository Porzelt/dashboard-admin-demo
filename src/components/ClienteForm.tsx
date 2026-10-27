import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clienteSchema, type ClienteForm as Valores } from '../domain/validacao'
import { ROTULO_STATUS_CLIENTE } from '../domain/types'

const VAZIO: Valores = { nome: '', email: '', telefone: '', empresa: '', cidade: '', status: 'ativo' }

interface Props {
  inicial?: Valores
  onSubmit: (v: Valores) => void | Promise<void>
  onCancelar: () => void
}

function Campo({ id, rotulo, erro, children }: { id: string; rotulo: string; erro?: string; children: React.ReactNode }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{rotulo}</label>
      {children}
      {erro && (
        <span className="erro" role="alert">
          {erro}
        </span>
      )}
    </div>
  )
}

export function ClienteForm({ inicial = VAZIO, onSubmit, onCancelar }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Valores>({ resolver: zodResolver(clienteSchema), defaultValues: inicial })

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Campo id="nome" rotulo="Nome" erro={errors.nome?.message}>
        <input id="nome" className="input" autoComplete="off" aria-invalid={!!errors.nome} {...register('nome')} />
      </Campo>
      <Campo id="email" rotulo="E-mail" erro={errors.email?.message}>
        <input id="email" className="input" type="email" aria-invalid={!!errors.email} {...register('email')} />
      </Campo>
      <Campo id="telefone" rotulo="Telefone" erro={errors.telefone?.message}>
        <input id="telefone" className="input" placeholder="(11) 91234-5678" aria-invalid={!!errors.telefone} {...register('telefone')} />
      </Campo>
      <Campo id="empresa" rotulo="Empresa" erro={errors.empresa?.message}>
        <input id="empresa" className="input" aria-invalid={!!errors.empresa} {...register('empresa')} />
      </Campo>
      <Campo id="cidade" rotulo="Cidade" erro={errors.cidade?.message}>
        <input id="cidade" className="input" aria-invalid={!!errors.cidade} {...register('cidade')} />
      </Campo>
      <Campo id="status" rotulo="Status">
        <select id="status" className="input" {...register('status')}>
          {Object.entries(ROTULO_STATUS_CLIENTE).map(([v, r]) => (
            <option key={v} value={v}>
              {r}
            </option>
          ))}
        </select>
      </Campo>
      <div className="form-acoes">
        <button type="button" className="btn" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primario" disabled={isSubmitting}>
          Salvar
        </button>
      </div>
    </form>
  )
}
