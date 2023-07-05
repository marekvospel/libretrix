import type { LayoutLoad } from "./$types"
import Olm from '@matrix-org/olm'

export const load: LayoutLoad = () => {
  globalThis.Olm = Olm
}

export const prerender = true