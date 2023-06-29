import { UserId } from '../../lib'

describe('UserId', () => {

  it('should be a valid userId', () => {
    const userId = new UserId('@marek:vospel.cz', false)

    expect(userId).toEqual({
      localpart: 'marek',
      servername: 'vospel.cz'
    })
  })

  it('should be a valid userId with port', () => {
    const userId = new UserId('@marek:1.2.3.4', false)

    expect(userId).toEqual({
      localpart: 'marek',
      servername: '1.2.3.4'
    })
  })

  it('should be a valid userId with ipv4, port', () => {
    const userId = new UserId('@marek:1.2.3.4:5678', false)

    expect(userId).toEqual({
      localpart: 'marek',
      servername: '1.2.3.4:5678'
    })
  })

  it('should be a valid userId with ipv6, port', () => {
    const userId = new UserId('@marek:[::1]:5678', false)

    expect(userId).toEqual({
      localpart: 'marek',
      servername: '[::1]:5678'
    })
  })

  it.fails('should have too short localpart', () => {
    new UserId('@:vospel.cz', false)
  })

  it.fails('should be missing servername', () => {
    new UserId('@marek:', false)
  })

  it.fails('should be too long', () => {
    new UserId(`@${'a'.repeat(255)}:a`, false)
  })

  it.fails('should not be valid with ASCII printable', () => {
    new UserId('@!:vospel.cz', false)
  })

  it('should be valid with ASCII printable', () => {
    const userId = new UserId('@!:vospel.cz')

    expect(userId).toEqual({
      localpart: '!',
      servername: 'vospel.cz'
    })
  })

  it('should be converted to string correctly', () => {
    const userId = new UserId('@marek:vospel.cz')

    expect(userId.toString()).toStrictEqual('@marek:vospel.cz')
  })

})