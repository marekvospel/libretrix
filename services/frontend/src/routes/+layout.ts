import type { LayoutLoad } from "./$types"
import Olm from '@matrix-org/olm'

import { logger } from "matrix-js-sdk/lib/logger"
import createDebug from 'debug'

export const load: LayoutLoad = () => {
  logger.methodFactory = (methodName, _level, loggerName) => {
    const debug = createDebug(typeof loggerName === 'string' ? loggerName : '')
    if (methodName !== 'error' && methodName !== 'warn')
    return debug
    
    return console[methodName]
  }
  logger.setLevel('TRACE')

  globalThis.Olm = Olm
}

export const prerender = true