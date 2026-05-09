import { Redis } from '@upstash/redis'

// Local dev: run `vercel env pull .env.local` to get env vars
const redis = Redis.fromEnv()

export default async function handler(req, res) {
  try {
    const count = await redis.incr('visitor_count')
    res.status(200).json({ value: count })
  } catch (error) {
    console.error('Redis error:', error)
    res.status(500).json({ value: null, error: 'Counter unavailable' })
  }
}
