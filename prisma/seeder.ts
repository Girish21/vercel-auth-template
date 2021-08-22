import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

const main = async () => {
  const password = await hash('Test123!', Number(process.env.HASH_ROUNDS))
  const defaultUser = await prisma.user.create({
    data: {
      email: 'test@test.com',
      password,
      updatedAt: new Date(),
    },
  })

  console.log(defaultUser)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
