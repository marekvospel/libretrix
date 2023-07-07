import { mergeConfig, defineProject } from 'vitest/config'
import shared from '../../vitest.config'

export default mergeConfig(
  shared,
  defineProject({
    test: {
      environment: 'jsdom'
    }
  })
)