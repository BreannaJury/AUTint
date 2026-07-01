// Node's built-in SQLite (Node 22.5+). Avoids a native-compile step entirely,
// which matters for a 1-hour MVP where you don't want npm install to fail
// on missing build tools. Requires Node >= 22.5 (ships with an experimental
// warning, which is safe to ignore for this prototype).
const { DatabaseSync } = require('node:sqlite')

const db = new DatabaseSync(':memory:')

db.exec(`
  CREATE TABLE enrolments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER NOT NULL,
    faculty TEXT NOT NULL,
    programme TEXT NOT NULL,
    level TEXT NOT NULL,                   -- 'Undergraduate' | 'Postgraduate'
    domestic_international TEXT NOT NULL,  -- 'Domestic' | 'International'
    student_count INTEGER NOT NULL
  );
`)

// Faculties -> programmes, loosely modelled on AUT's real faculty structure.
// All figures generated below are SYNTHETIC placeholder data for demo purposes only.
const FACULTIES = {
  'Business, Economics and Law': ['Business', 'Accounting', 'Marketing', 'Economics', 'Law'],
  'Design and Creative Technologies': ['Design', 'Creative Technologies', 'Architecture'],
  'Health and Environmental Sciences': [
    'Nursing',
    'Sport and Recreation',
    'Public Health',
    'Environmental Science',
  ],
  'Culture and Society': ['Education', 'Social Sciences', 'Communications'],
  'Engineering, Computer and Mathematical Sciences': [
    'Computer Science',
    'Information Technology',
    'Engineering',
  ],
  'Te Ara Poutama': ['Maori Development'],
}

const YEARS = Array.from({ length: 10 }, (_, i) => 2016 + i) // 2016..2025
const LEVELS = ['Undergraduate', 'Postgraduate']
const DOM_INTL = ['Domestic', 'International']

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function seed() {
  const rand = seededRandom(42)
  const insert = db.prepare(`
    INSERT INTO enrolments (year, faculty, programme, level, domestic_international, student_count)
    VALUES (@year, @faculty, @programme, @level, @domestic_international, @student_count)
  `)
  const rows = []

  for (const faculty of Object.keys(FACULTIES)) {
    for (const programme of FACULTIES[faculty]) {
      const base = 60 + Math.floor(rand() * 220)
      const growthRate = 0.9 + rand() * 0.25 // some programmes grow, some shrink slightly

      YEARS.forEach((year, yIdx) => {
        for (const level of LEVELS) {
          for (const domIntl of DOM_INTL) {
            const levelFactor = level === 'Undergraduate' ? 1 : 0.4
            const domFactor = domIntl === 'Domestic' ? 1 : 0.35
            const trend = Math.pow(growthRate, yIdx / 9)
            const noise = 0.85 + rand() * 0.3
            const count = Math.max(3, Math.round(base * levelFactor * domFactor * trend * noise))
            rows.push({
              year,
              faculty,
              programme,
              level,
              domestic_international: domIntl,
              student_count: count,
            })
          }
        }
      })
    }
  }

  db.exec('BEGIN')
  for (const row of rows) insert.run(row)
  db.exec('COMMIT')

  console.log(`Seeded ${rows.length} enrolment rows across ${YEARS.length} years (${YEARS[0]}-${YEARS[YEARS.length - 1]}).`)
}

seed()

const SCHEMA_DESCRIPTION = `
Table: enrolments
Columns:
  - year (INTEGER, ${YEARS[0]}-${YEARS[YEARS.length - 1]})
  - faculty (TEXT, one of: ${Object.keys(FACULTIES)
    .map((f) => `"${f}"`)
    .join(', ')})
  - programme (TEXT, one of: ${Object.values(FACULTIES)
    .flat()
    .map((p) => `"${p}"`)
    .join(', ')})
  - level (TEXT, 'Undergraduate' or 'Postgraduate')
  - domestic_international (TEXT, 'Domestic' or 'International')
  - student_count (INTEGER, number of enrolled students for that row)

Each row is a count of students for a unique combination of year/faculty/programme/level/domestic_international.
To answer questions about totals, use SUM(student_count) and GROUP BY the relevant dimensions.
`

module.exports = { db, SCHEMA_DESCRIPTION }
