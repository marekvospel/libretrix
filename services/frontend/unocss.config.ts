import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
  ],
  transformers: [
    transformerDirectives(),
  ],
  safelist: [
    'h-screen',
    'sticky',
    'top-0',
  ],
  theme: {
    colors: {
      text: {
        light: '#E8E8E8',
        DEFAULT: '#E8E8E8',
        semilight: '#CBCBCB',
        dark: '#383333',
      },
      primary: {
        400: '#70CBF1',
        DEFAULT: '#4EBEEE',
        500: '#4EBEEE',
        600: '#35A0CD',
        900: '#101937',
      },
      mauve: '#cba6f7',
      red: '#f38ba8',
      teal: '#179299',
      sky: '#04a5e5',
      subtext1: '#bac2de',
      subtext0: '#a6adc8',
      surface2: '#585b70',
      surface1: '#45475a',
      surface0: '#313244',
      base: '#1e1e2e',
      mantle: '#181825',
      crust: '#11111b',
    },
  },
})
