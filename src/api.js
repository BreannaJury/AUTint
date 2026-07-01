const API_URL = import.meta.env.VITE_API_URL || ''

export async function ping() {
  const res = await fetch(`${API_URL}/ping`)
  if (!res.ok) {
    throw new Error(`Ping failed: ${res.status}`)
  }
  return res.json()
}
