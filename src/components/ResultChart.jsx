import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import Box from '@mui/material/Box'
import { CHART_COLORS } from '../theme'

export default function ResultChart({ chart }) {
  if (!chart || !chart.data || chart.data.length === 0) return null

  const { type, xKey, series, data } = chart

  return (
    <Box sx={{ width: '100%', height: 320, mt: 1 }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'line' ? (
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e3e8f0" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            {series.length > 1 && <Legend />}
            {series.map((s, i) => (
              <Line
                key={s}
                type="monotone"
                dataKey={s}
                stroke={CHART_COLORS[i % CHART_COLORS.length]}
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        ) : type === 'pie' ? (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={data}
              dataKey={series[0]}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={110}
              label
            >
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        ) : (
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e3e8f0" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            {series.length > 1 && <Legend />}
            {series.map((s, i) => (
              <Bar key={s} dataKey={s} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </Box>
  )
}
