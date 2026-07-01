const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

function buildSystemPrompt(schemaDescription) {
  return `You are a data assistant for AUT (Auckland University of Technology) helping staff explore a student enrolments dataset by asking questions in plain English.

${schemaDescription}

You must respond with ONLY a single JSON object (no markdown fences, no commentary) matching this exact shape:
{
  "sql": "a single read-only SQLite SELECT statement that answers the question",
  "summary": "a short 1-2 sentence plain-English answer to the question",
  "chartType": "bar" | "line" | "pie" | "table",
  "xKey": "the column alias in your SELECT to use as the x-axis / category label",
  "seriesKey": "the column alias to split multiple series by, or null if not needed",
  "yKey": "the column alias to use as the numeric value"
}

Rules:
- Only ever produce a single SELECT statement. Never INSERT/UPDATE/DELETE/DROP/ATTACH/PRAGMA or multiple statements.
- Always alias computed/aggregated columns (e.g. SUM(student_count) AS total) and make sure xKey/seriesKey/yKey exactly match the aliases or column names in your SELECT.
- Prefer "line" for a single trend over years, "bar" for comparisons across categories or grouped-by-year comparisons, "pie" for a breakdown of parts of a whole at a single point in time, and "table" if a chart doesn't make sense for the question.
- If the question implies "last N years", use the N most recent years in the dataset.
- If seriesKey is not needed, set it to null (not the string "null").
- Keep SQL simple and correct SQLite syntax.`
}

function extractJson(text) {
  // Strip common markdown code fences if the model adds them despite instructions.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = fenced ? fenced[1] : text
  return JSON.parse(candidate.trim())
}

async function askOpenRouter({ question, schemaDescription }) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set. Add it to your .env file.')
  }
  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini'

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildSystemPrompt(schemaDescription) },
        { role: 'user', content: question },
      ],
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`OpenRouter request failed (${res.status}): ${errText}`)
  }

  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('OpenRouter returned no content.')
  }

  let parsed
  try {
    parsed = extractJson(content)
  } catch (err) {
    throw new Error(`Could not parse model response as JSON: ${content}`)
  }

  if (!parsed.sql || typeof parsed.sql !== 'string') {
    throw new Error('Model response was missing a "sql" field.')
  }

  return parsed
}

module.exports = { askOpenRouter }
