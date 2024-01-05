/**
 * This utility class can be used to parse userIds and get servername and localpart from them.
 * The API is inspired by DOM's URI class.
 *
 * @see {@link https://spec.matrix.org/v1.6/appendices/#user-identifiers}
 * @see {@link UserId#constructor}
 */
export class UserId {
  /**
   * The user's username.
   */
  localpart: string
  /**
   * The server name. Can include `:` followed by port.
   */
  servername: string

  /**
   * This constructor parses it's first argument (userId) and creates UserId object from it.
   *
   * @param userId The userId to be parsed
   * @param extended_localpart Whether legacy localpart should be used (any printable ASCII char except :)
   *
   * @throws InvalidUserIdError if the passed userId is invalid
   * @see {@link InvalidUserIdError}
   */
  constructor(userId: string, extended_localpart = true) {
    const localpartRegex = !extended_localpart
      ? '(?<localpart>[a-z0-9._=\\-\\/]+)'
      : '(?<localpart>[\\x21-\\x39\\x3b-\\x7e]+)'
    const regex = new RegExp(
      `^@${localpartRegex}:(?<servername>(?:(?:\\d{1,3}\\.){3}\\d{1,3}|[a-zA-Z\\d\\.\\-]+|\\[([0-9a-f]{1,4}::?|::){0,15}[0-9a-f]{1,4}\\])(?::\\d{1,5}?)?)$`,
    )

    const result = regex.exec(userId)

    if (!result)
      throw new InvalidUserIdError('')

    const { localpart, servername } = result.groups!

    if (userId.length > 255)
      throw new InvalidUserIdError('UserId is too long!', localpart, servername)

    this.localpart = localpart
    this.servername = servername
  }

  toString() {
    return `@${this.localpart}:${this.servername}`
  }
}

export class InvalidUserIdError extends Error {
  localpart?: string
  servername?: string

  constructor(reason?: string, localpart?: string, servername?: string) {
    super(reason ? 'Invalid UserId!' : `Invalid UserId: ${reason}`)

    this.localpart = localpart
    this.servername = servername
  }
}
