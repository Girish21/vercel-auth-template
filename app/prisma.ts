import { PrismaClient } from '@prisma/client'

let client: PrismaClient

if (process.env.NODE_ENV === 'production') {
  client = new PrismaClient()
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient()
  }
  client = globalThis.prisma
}

export default client
