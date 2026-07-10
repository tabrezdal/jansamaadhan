import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createPrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

  // Auto-retry on Prisma Postgres / Neon serverless cold starts.
  // On the free tier the DB pauses after inactivity — the first request
  // after a pause fails while the server warms up (typically 3–8 seconds).
  // This middleware retries every query transparently so the user never
  // sees the "Can't reach database server" error.
  client.$use(async (params, next) => {
    const MAX_RETRIES = 3
    const DELAY_MS    = 4000

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        return await next(params)
      } catch (err) {
        const msg = err instanceof Error ? err.message : ''
        const isColdStart =
          msg.includes("Can't reach database") ||
          msg.includes('pooled.db.prisma.io') ||
          msg.includes('ECONNREFUSED') ||
          msg.includes('Connection refused') ||
          msg.includes('getaddrinfo') ||
          msg.includes('P1001')

        if (isColdStart && attempt < MAX_RETRIES) {
          console.warn(
            `[DB] Cold start detected — waiting ${DELAY_MS}ms then retrying (attempt ${attempt}/${MAX_RETRIES})`
          )
          await new Promise(r => setTimeout(r, DELAY_MS))
          continue
        }

        throw err
      }
    }

    // Should never reach here but TypeScript needs a return
    throw new Error('[DB] Max retries exceeded')
  })

  return client
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}