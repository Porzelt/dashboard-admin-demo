import { useEffect, useState } from 'react'

/** Roteamento por hash (#/clientes/c1): funciona no GitHub Pages sem configuração de servidor. */
export function parseRota(hash: string): string[] {
  return hash.replace(/^#\/?/, '').split('/').filter(Boolean)
}

export function useRota(): string[] {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const f = () => setHash(window.location.hash)
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  return parseRota(hash)
}

export const ir = (caminho: string) => {
  window.location.hash = caminho
}
