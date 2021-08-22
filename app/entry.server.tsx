import * as React from 'react'
import type { EntryContext } from 'remix'
import ReactDOMServer from 'react-dom/server'
import { RemixServer } from 'remix'
import * as dotenv from 'dotenv'

dotenv.config()

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  let markup = ReactDOMServer.renderToString(
    <RemixServer context={remixContext} url={request.url} />
  )

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: {
      ...Object.fromEntries(responseHeaders),
      'Content-Type': 'text/html',
    },
  })
}
