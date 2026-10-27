// Gera docs/screens/*.png e docs/demo.gif a partir do build (rode `npm run build` e `npx vite preview --port 4173` antes).
// Uso: node scripts/capturas.mjs [url]
import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import gifenc from 'gifenc'
import { writeFileSync, mkdirSync } from 'node:fs'

const { GIFEncoder, quantize, applyPalette } = gifenc
const URL_BASE = process.argv[2] ?? 'http://localhost:4173/'
mkdirSync('docs/screens', { recursive: true })

const browser = await chromium.launch({ channel: 'msedge' })
const espera = (ms) => new Promise((r) => setTimeout(r, ms))

async function pagina(viewport, tema = 'claro') {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 })
  await ctx.addInitScript((t) => localStorage.setItem('tema', t), tema)
  return ctx.newPage()
}

// Capturas estáticas (desktop claro/escuro e mobile)
const p = await pagina({ width: 1366, height: 860 })
const telas = [
  ['1-dashboard', '#/dashboard'],
  ['2-clientes', '#/clientes'],
  ['3-solicitacoes', '#/solicitacoes'],
  ['4-cadastro', '#/clientes/c3'],
  ['5-relatorios', '#/relatorios'],
]
for (const [nome, hash] of telas) {
  await p.goto(URL_BASE + hash)
  await espera(900)
  if (nome === '3-solicitacoes') {
    await p.locator('tbody tr').first().click()
    await espera(300)
  }
  await p.screenshot({ path: `docs/screens/${nome}.png` })
}
const escuro = await pagina({ width: 1366, height: 860 }, 'escuro')
await escuro.goto(URL_BASE + '#/dashboard')
await espera(900)
await escuro.screenshot({ path: 'docs/screens/6-dashboard-escuro.png' })
const mobile = await pagina({ width: 390, height: 844 })
await mobile.goto(URL_BASE + '#/clientes')
await espera(900)
await mobile.screenshot({ path: 'docs/screens/7-mobile-clientes.png' })

// GIF: sequência curta de interações
const g = await pagina({ width: 1100, height: 700 })
const quadros = []
const quadro = async (atraso = 900) => quadros.push({ png: PNG.sync.read(await g.screenshot()), atraso })
await g.goto(URL_BASE + '#/dashboard')
await espera(1000)
await quadro(1600)
await g.click('a[href="#/clientes"]')
await espera(700)
await quadro()
await g.fill('input[type=search]', 'ana')
await espera(300)
await quadro()
await g.fill('input[type=search]', '')
await g.click('button.th-btn:has-text("Receita")')
await g.click('button.th-btn:has-text("Receita")')
await espera(300)
await quadro()
await g.click('text=+ Novo cliente')
await espera(500)
await g.click('button[type=submit]')
await espera(300)
await quadro(1300)
await g.click('a[href="#/solicitacoes"]')
await espera(700)
await g.click('[role=tab]:has-text("Em andamento")')
await espera(300)
await g.locator('tbody tr').first().click()
await espera(400)
await quadro(1300)
await g.click('a[href="#/relatorios"]')
await espera(700)
await quadro()
await g.click('button[aria-label="Alternar tema"]')
await espera(500)
await quadro(1600)

const { width, height } = quadros[0].png
const gif = GIFEncoder()
for (const { png, atraso } of quadros) {
  const palette = quantize(png.data, 256)
  gif.writeFrame(applyPalette(png.data, palette), width, height, { palette, delay: atraso })
}
gif.finish()
writeFileSync('docs/demo.gif', gif.bytes())
await browser.close()
console.log(`ok: ${telas.length + 2} capturas, gif com ${quadros.length} quadros`)
