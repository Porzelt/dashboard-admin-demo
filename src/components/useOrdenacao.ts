import { useState } from 'react'
import type { Direcao } from '../domain/consulta'

/** Estado de ordenação de uma tabela: clicar na mesma coluna inverte a direção; outra coluna começa crescente. */
export function useOrdenacao<C extends string>(inicial: C, direcaoInicial: Direcao = 'asc') {
  const [ordem, setOrdem] = useState<C>(inicial)
  const [direcao, setDirecao] = useState<Direcao>(direcaoInicial)
  const alternar = (campo: string) => {
    if (campo === ordem) setDirecao((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setOrdem(campo as C)
      setDirecao('asc')
    }
  }
  return { ordem, direcao, alternar }
}
