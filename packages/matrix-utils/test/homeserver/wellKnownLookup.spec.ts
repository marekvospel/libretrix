import { wellKnownLookup } from '../../src'

describe('wellKnownLookup', () => {
  it.fails('should fail for having invalid protocol', async () => {
    await wellKnownLookup('ftp://vospel.cz')
  })

  it.fails('should fail for DNS errors', async () => {
    await wellKnownLookup('http://not-matrix.vospel.cz')
  })

  it('should lookup a valid matrix server', async () => {
    let result = await wellKnownLookup('vospel.cz')

    expect(result).not.toBeFalsy()

    result = await wellKnownLookup('matrix.org')

    expect(result).not.toBeFalsy()
  })
})
