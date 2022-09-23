import { defineConfig, presetUno, presetWebFonts, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  shortcuts: [
    { theme: 'bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100' },
    { surface: 'dark:bg-dark-600 bg-white' },
    {
      'summary-icon':
        '[&_path]:dark:fill-secondary-90 [&_path]:dark:stroke-secondary-90 [&_path]:fill-none [&_path]:stroke-dark-9',
    },
  ],
  theme: {
    colors: {
      primary: {
        10: 'theme("colors.indigo.200")',
        30: 'theme("colors.indigo.300")',
        50: 'theme("colors.indigo.400")',
        70: 'theme("colors.indigo.500")',
        90: 'theme("colors.indigo.600")',
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
      line: 'theme("colors.dark.100")',
      background: {
        light: '#F0F0F0',
        dark: 'theme("colors.dark.900")',
      },
    },
    fontSize: {
      body: '0.875rem',
    },
  },

  presets: [
    presetUno(),
    presetWebFonts({
      fonts: {
        sans: 'Poppins:400,700',
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
