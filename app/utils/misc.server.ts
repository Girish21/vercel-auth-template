const getFromEnv = (
  key: string,
  object: Record<string, string | undefined> = process.env
): string => {
  const value = object[key]
  if (!value) throw new Error(`${key} should be in environment`)

  return value
}

export { getFromEnv }
