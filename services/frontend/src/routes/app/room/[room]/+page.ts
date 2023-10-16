import type { PageLoad } from "./$types"

export const load: PageLoad = ({ params }) => {

  return ({
    roomId: params.room
  })
}

export const prerender = false