export async function wellKnownLookup(baseUrl: string): Promise<string> {
  const httpPrefixed = !/^https?:\/\//.test(baseUrl) ? `https://${baseUrl}` : baseUrl

  const url = new URL('/.well-known/matrix/client', httpPrefixed)
  const result = await fetch(url)
  const data = await result.json()

  if (!result.ok)
    throw new Error('The well known lookup didn\'t respond with 200!')
  if (!data?.['m.homeserver']?.base_url)
    throw new Error('The well known lookup didn\'t include `m.homeserver`.base_url!')

  return data['m.homeserver'].base_url
}
