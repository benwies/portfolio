import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  try {
    const count = await kv.incr('visitor_count')
    res.status(200).json({ value: count })
  } catch (error) {
    console.error('KV error:', error)
    res.status(500).json({ value: null, error: 'KV unavailable' })
  }
}
