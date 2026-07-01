const FORBIDDEN = /\b(INSERT|UPDATE|DELETE|DROP|ALTER|ATTACH|DETACH|PRAGMA|VACUUM|REPLACE|CREATE|TRIGGER)\b/i

function assertSafeSelect(sql) {
  const trimmed = sql.trim().replace(/;+\s*$/, '') // allow one trailing semicolon

  if (trimmed.includes(';')) {
    throw new Error('Only a single SQL statement is allowed.')
  }
  if (!/^select\b/i.test(trimmed)) {
    throw new Error('Only SELECT statements are allowed.')
  }
  if (FORBIDDEN.test(trimmed)) {
    throw new Error('Query contains a disallowed keyword.')
  }

  return trimmed
}

module.exports = { assertSafeSelect }
