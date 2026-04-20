const isBrowser = typeof window !== 'undefined' || typeof self !== 'undefined'

if (isBrowser) {
  throw new Error(
    '[tenno-companion] This module is server-only. Do not import it in the browser. Use "@tenno-companion/kim" instead.'
  )
}

export * from './lib/chat-factory'
