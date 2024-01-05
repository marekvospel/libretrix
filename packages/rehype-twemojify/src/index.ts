import type { Root } from 'rehype-parse/lib'
import type { Plugin } from 'unified'
import { findAndReplace } from 'hast-util-find-and-replace'

const BASE = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@v14.0.2/assets/svg/'

export const rehypeTwemojify: Plugin<[], Root, Root> = () => {
  return (tree) => {
    findAndReplace(tree, [
      // unicode emoji regex
      /\p{Emoji}/gu,
      (node) => {
        if (typeof node !== 'string')
          return node
        if (/[0-9]/.test(node))
          return node

        let code = node.codePointAt(0)!
        let hex

        if (code > 0xD800 && code < 0xDBFF) {
          const next = node.codePointAt(1)
          if (!next)
            return node
          code = (code - 0xD800) * 0x400 + next - 0xDC00 + 0x10000
        }
        else {
          hex = code.toString(16)
        }

        const url = `${BASE + hex}.svg`
        return {
          type: 'element',
          tagName: 'img',
          properties: {
            'src': url,
            'alt': node,
            'decoding': 'async',
            'loading': 'lazy',
            'height': 32,
            'data-lb-twemoji': '',
          },
        }
      },
    ], {})
  }
}
