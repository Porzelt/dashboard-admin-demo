import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export const CORES = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2']

export interface Ponto {
  nome: string
  valor: number
}

const eixo = { stroke: 'var(--muted)', fontSize: 12 }
const dica = { contentStyle: { background: 'var(--card)', border: '1px solid var(--borda)', borderRadius: 8, color: 'var(--texto)' } }

export function GraficoLinha({ dados, formato }: { dados: Ponto[]; formato?: (v: number) => string }) {
  return (
    <div className="grafico" role="img" aria-label="Gráfico de linha">
      <ResponsiveContainer width="100%" height={240} initialDimension={{ width: 500, height: 240 }}>
        <LineChart data={dados} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--borda)" />
          <XAxis dataKey="nome" {...eixo} />
          <YAxis {...eixo} tickFormatter={formato} width={56} />
          <Tooltip {...dica} formatter={(v) => (formato ? formato(Number(v)) : String(v))} />
          <Line isAnimationActive={false} type="monotone" dataKey="valor" stroke={CORES[0]} strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function GraficoBarra({ dados }: { dados: Ponto[] }) {
  return (
    <div className="grafico" role="img" aria-label="Gráfico de barras">
      <ResponsiveContainer width="100%" height={240} initialDimension={{ width: 500, height: 240 }}>
        <BarChart data={dados} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--borda)" />
          <XAxis dataKey="nome" {...eixo} />
          <YAxis {...eixo} allowDecimals={false} />
          <Tooltip {...dica} cursor={{ fill: 'var(--hover)' }} />
          <Bar isAnimationActive={false} dataKey="valor" radius={[6, 6, 0, 0]}>
            {dados.map((_, i) => (
              <Cell key={i} fill={CORES[i % CORES.length]} />
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
            {dados.map((_, i) => (
              <Cell key={i} fill={CORES[i % CORES.length]} />
            ))}
          </Pie>
          <Tooltip {...dica} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="legenda">
        {dados.map((d, i) => (
          <li key={d.nome}>
            <i style={{ background: CORES[i % CORES.length] }} /> {d.nome}: <strong>{d.valor}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
