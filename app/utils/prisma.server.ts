import prisma from '../prisma'
import { generateHash } from './bcrypt.server'
import { sessionExpirationTime } from './session.server'

const geExpirationDate = () => new Date(Date.now() + sessionExpirationTime)

const getUserFromSessionId = async (id: string) => {
  const data = await prisma.session.findUnique({
    where: { id },
    select: {
      expirationDate: true,
      id: true,
      user: { select: { email: true, id: true, firstName: true } },
    },
  })

  if (!data) {
    throw new Error('session does not exist')
  }

  if (Date.now() > data.expirationDate.getTime()) {
    await prisma.session.delete({ where: { id } })
    throw new Error('session expired, login again')
  }

  const twoWeeks = 1000 * 60 * 60 * 24 * 7 * 2
  if (data.expirationDate.getTime() < Date.now() + twoWeeks) {
    const newExpirationDate = new Date(data.expirationDate.getTime() + twoWeeks)
    await prisma.session.update({
      where: { id },
      data: {
        expirationDate: newExpirationDate,
      },
    })
  }

  return { user: data.user }
}

const getSessionDetails = async (id: string) => {
  return prisma.session.findUnique({
    where: { id },
    select: { createdAt: true, expirationDate: true },
  })
}

const createUserIfNotExist = async (
  email: string,
  password: string,
  name: string
) => {
  const userExist = await prisma.user.findUnique({ where: { email } })

  if (userExist) {
    throw new Error('accout with this email already exist, please login')
  }

  const hashPassword = await generateHash(password)

  return prisma.user.create({
    data: {
      email,
      password: hashPassword,
      firstName: name,
    },
    select: { id: true },
  })
}

const getUserFromEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true },
  })
}

const createSession = async (id: string) => {
  return prisma.session.create({
    data: {
      userId: id,
      expirationDate: geExpirationDate(),
    },
  })
}

const deleteSession = async (id: string) => {
  return prisma.session.delete({ where: { id } })
}

export {
  createSession,
  createUserIfNotExist,
  deleteSession,
  getSessionDetails,
  getUserFromEmail,
  getUserFromSessionId,
}
