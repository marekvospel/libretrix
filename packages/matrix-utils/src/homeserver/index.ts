
export async function wellKnownLookup(baseUrl: string): Promise<string> {
    const httpPrefixed = !/^https?:\/\//.test(baseUrl) ? `https://${baseUrl}` : baseUrl

    try {
      const url = new URL('/.well-known/matrix/client', httpPrefixed)
      const result = await fetch(url)
      const data = await result.json()

      if (!result.ok) throw new Error()
      if (!data?.['m.homeserver']?.base_url) throw new Error()

      return data['m.homeserver'].base_url
    } catch {
      throw new Error('Could not fetch homeserver base url')
    }
}