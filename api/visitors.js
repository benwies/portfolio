export default async function handler(req, res) {
  try {
    const { kv } = await import('@vercel/kv')
    const count = await kv.incr('visitor_count')
    res.status(200).json({ value: count })
  } catch {
    res.status(503).json({ value: null })
  }
}
