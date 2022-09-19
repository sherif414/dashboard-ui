import { defineConfig, presetUno, presetWebFonts, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  shortcuts: [],
  theme: {
    colors: {
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
      line: '#E1E2E9',
    },
    fontSize: {
      body: '0.875rem',
    },
  },

  presets: [
    presetUno(),
    presetWebFonts({
      fonts: {
        sans: 'Open Sans',
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
