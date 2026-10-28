import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// Uma cor neutra para séries sem significado; cores semânticas só quando a categoria tem significado
// (as mesmas dos badges: azul = aberta, âmbar = em andamento/média, verde = concluída, vermelho = alta).
export const COR_SERIE = '#3b82f6'
export const COR = { azul: '#3b82f6', ambar: '#f59e0b', verde: '#22c55e', vermelho: '#ef4444', cinza: '#94a3b8' }

export interface Ponto {
  nome: string
  valor: number
  cor?: string
}

const eixo = { stroke: 'var(--muted)', fontSize: 12 }
// Tooltip legível nos dois temas: texto e item na cor do tema (o padrão do Recharts é escuro fixo).
const dica = {
  contentStyle: { background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-borda)', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,.25)' },
  labelStyle: { color: 'var(--texto)', fontWeight: 600, marginBottom: 2 },
  itemStyle: { color: 'var(--texto)' },
}

export function GraficoLinha({ dados, formato, nome = 'Total' }: { dados: Ponto[]; formato?: (v: number) => string; nome?: string }) {
  return (
    <div className="grafico" role="img" aria-label="Gráfico de linha">
      <ResponsiveContainer width="100%" height={240} initialDimension={{ width: 500, height: 240 }}>
        <LineChart data={dados} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--borda)" />
          <XAxis dataKey="nome" {...eixo} />
          <YAxis {...eixo} tickFormatter={formato} width={56} />
          <Tooltip {...dica} formatter={(v) => (formato ? formato(Number(v)) : String(v))} />
          <Line isAnimationActive={false} name={nome} type="monotone" dataKey="valor" stroke={COR_SERIE} strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function GraficoBarra({ dados, nome = 'Quantidade' }: { dados: Ponto[]; nome?: string }) {
  return (
    <div className="grafico" role="img" aria-label="Gráfico de barras">
      <ResponsiveContainer width="100%" height={240} initialDimension={{ width: 500, height: 240 }}>
        <BarChart data={dados} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--borda)" />
          <XAxis dataKey="nome" {...eixo} />
          <YAxis {...eixo} allowDecimals={false} />
          <Tooltip {...dica} cursor={{ fill: 'var(--hover)' }} />
          <Bar isAnimationActive={false} name={nome} dataKey="valor" radius={[4, 4, 0, 0]} maxBarSize={36}>
            {dados.map((d, i) => (
              <Cell key={i} fill={d.cor ?? COR_SERIE} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function GraficoPizza({ dados }: { dados: Ponto[] }) {
  return (
    <div className="grafico" role="img" aria-label="Gráfico de pizza">
      <ResponsiveContainer width="100%" height={240} initialDimension={{ width: 500, height: 240 }}>
        <PieChart>
          <Pie isAnimationActive={false} data={dados} dataKey="valor" nameKey="nome" innerRadius={50} outerRadius={85} paddingAngle={2} stroke="none">
            {dados.map((d, i) => (
              <Cell key={i} fill={d.cor ?? COR_SERIE} />
            ))}
          </Pie>
          <Tooltip {...dica} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="legenda">
        {dados.map((d) => (
          <li key={d.nome}>
            <i style={{ background: d.cor ?? COR_SERIE }} /> {d.nome}: <strong>{d.valor}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
