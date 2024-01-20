import { antfu } from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
    jsx: false,
  },

  typescript: true,
  svelte: true,
  jsonc: true,

  ignores: ['**/node_modules', '**/dist', '**/build', '**/.svelte-kit', '!services/frontend/src/lib'],
})
