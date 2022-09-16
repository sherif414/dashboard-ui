import {
  defineConfig,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    {
      'flex-center': 'flex flex-col items-center',
      'nav-link': 'flex gap-x-3 relative p4 items-center m-w-8rem rounded-3',
    },
  ],
  theme: {
    colors: {
      black: {
        10: '#BEC0CA',
        30: '#8B8D97',
        50: '#53545C',
        70: '#37393F',
        90: '#1C1D22',
      },
      primary: {
        10: '#DBDEEE',
        30: '#B6BFE8',
        50: '#97A5EB',
        70: '#7C8FEC',
        90: '#5570F1',
      },
      secondary: {
        10: '#FEF9F2',
        30: '#FFF2E2',
        50: '#FFEAD1',
        70: '#FFDFBA',
        90: '#FFCC91',
      },
      success: '#519C66',
      error: '#CC5F5F',
    },
  },
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetWebFonts({
      fonts: {
        sans: 'Roboto',
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
