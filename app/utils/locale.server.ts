import type { LoaderFunction, Request } from 'remix'

const withLocale = (
  request: Request,
  next: (locale: string[]) => ReturnType<LoaderFunction>
) => {
  const acceptedLanguages = request.headers.get('accepted-language')

  let locale: string[]
  if (!acceptedLanguages) {
    locale = ['en-US']
  } else {
    locale = acceptedLanguages
      .split(/[,;]/)
      .filter((str) => !str.startsWith('q'))
  }

  return next(locale)
}

export { withLocale }
