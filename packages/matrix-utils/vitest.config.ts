import { defineProject, mergeConfig } from "vitest/config";
import shared from '../../vitest.config'

export default mergeConfig(
  shared,
  defineProject({

  })
)