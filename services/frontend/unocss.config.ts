import { defineConfig, presetUno, presetIcons, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons()
  ],
  transformers: [
    transformerDirectives()
  ],
  safelist: [
    'h-screen',
    'sticky',
    'top-0'
  ],
  theme: {
    colors: {
      mauve: '#cba6f7',
      red: '#f38ba8',
      text: '#cdd6f4',
      subtext1: '#bac2de',
      subtext0: '#a6adc8',
      surface2: '#585b70',
      surface1: '#45475a',
      surface0: '#313244',
      base: '#1e1e2e',
      mantle: '#181825',
      crust: '#11111b'
    }
  }
})