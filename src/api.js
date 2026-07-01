const API_URL = import.meta.env.VITE_API_URL || ''

export async function ping() {
  const res = await fetch(`${API_URL}/ping`)
  if (!res.ok) {
    throw new Error(`Ping failed: ${res.status}`)
  }
  return res.json()
}

// Uses the /api proxy configured in vite.config.js in dev (rewritten to /chat
// on the Express server). Set VITE_API_URL for a non-proxied deployment.
export async function askQuestion(question) {
  const base = API_URL ? `${API_URL}/chat` : '/api/chat'
  const res = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`)
  }
  return data
}
