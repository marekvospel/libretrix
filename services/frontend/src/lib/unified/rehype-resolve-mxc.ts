import type { MatrixClient } from 'matrix-js-sdk'
import type { Root } from 'rehype-parse/lib'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export interface Options {
  matrixClient: MatrixClient
}

export const rehypeResolveMxc: Plugin<[Options], Root, Root> = (optios: Options) => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') {
        return
      }

      if (!node.properties.src || typeof node.properties.src !== 'string' || !node.properties.src.startsWith('mxc://')) {
        return
      }

      node.properties.src = optios.matrixClient.mxcUrlToHttp(node.properties.src)
    })
  }
}