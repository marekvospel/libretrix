import type { LayoutLoad } from "./$types"
import { browser } from '$app/environment'
import Olm from '@matrix-org/olm'
import '$lib/i18n'

import { logger } from "matrix-js-sdk/lib/logger"
import createDebug from 'debug'
import { locale, waitLocale } from "svelte-i18n"

export const load: LayoutLoad = async () => {
  logger.methodFactory = (methodName, _level, loggerName) => {
    const debug = createDebug(typeof loggerName === 'string' ? loggerName : '')
    if (methodName !== 'error' && methodName !== 'warn')
    return debug
    
    return console[methodName]
  }
  logger.setLevel('TRACE')

  globalThis.Olm = Olm

  if (browser) {
    locale.set(localStorage.getItem('locale') ?? window.navigator.language)
  }

  await waitLocale()
}

export const prerender = true