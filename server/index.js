require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { db, SCHEMA_DESCRIPTION } = require('./db')
const { askOpenRouter } = require('./openrouter')
const { assertSafeSelect } = require('./queryGuard')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' })
})

// Pivots flat SQL rows into a shape Recharts can consume directly.
// If seriesKey is present, rows are grouped by xKey with one column per series value.
function buildChartData(rows, { xKey, seriesKey, yKey }) {
  if (!xKey || !yKey || rows.length === 0) {
    return { series: [], data: [] }
  }

  if (!seriesKey) {
    return {
      series: [yKey],
      data: rows.map((r) => ({ [xKey]: r[xKey], [yKey]: r[yKey] })),
    }
  }

  const grouped = new Map()
  const seriesSet = new Set()

  for (const r of rows) {
    const xVal = r[xKey]
    const seriesVal = String(r[seriesKey])
    seriesSet.add(seriesVal)
    if (!grouped.has(xVal)) grouped.set(xVal, { [xKey]: xVal })
    grouped.get(xVal)[seriesVal] = r[yKey]
  }

  return { series: Array.from(seriesSet), data: Array.from(grouped.values()) }
}

app.post('/chat', async (req, res) => {
  const question = (req.body?.question || '').trim()
  if (!question) {
    return res.status(400).json({ error: 'A "question" field is required.' })
  }

  try {
    const plan = await askOpenRouter({ question, schemaDescription: SCHEMA_DESCRIPTION })
    const safeSql = assertSafeSelect(plan.sql)

    let rows
    try {
      rows = db.prepare(safeSql).all()
    } catch (dbErr) {
      return res.status(422).json({
        error: `The generated SQL failed to run: ${dbErr.message}`,
        sql: safeSql,
      })
    }

    const columns = rows.length > 0 ? Object.keys(rows[0]) : []
    const chartType = plan.chartType === 'none' ? 'table' : plan.chartType || 'table'

    let chart = { type: 'table', series: [], data: [] }
    if (chartType !== 'table') {
      const { series, data } = buildChartData(rows, {
        xKey: plan.xKey,
        seriesKey: plan.seriesKey || null,
        yKey: plan.yKey,
      })
      chart = { type: chartType, xKey: plan.xKey, series, data }
    }

    res.json({
      summary: plan.summary || '',
      sql: safeSql,
      table: { columns, rows },
      chart,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Something went wrong.' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API running on port ${PORT}`))
