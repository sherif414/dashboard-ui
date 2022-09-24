import { defineConfig, presetUno, presetWebFonts, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  shortcuts: [
    // shortcut components
    {
      'summary-icon': 'p2 rounded-3 dark:bg-dark-2 bg-accent-3 fill-gray-1 box-content',
    },

    // typography - colors
    { 'typo-clr-base': 'dark:text-gray-1 text-dark-9' },
    { 'typo-clr-muted': 'dark:text-gray-4 text-dark-6' },
    { 'typo-clr-disabled': 'dark:text-gray-7 text-dark-3' },
    //typography - sizes
    { 'typo-sm': 'text-3' },
    { 'typo-base': 'text-0.875rem' },
    { 'typo-head': 'text-4' },
    { 'typo-lg': 'text-5' },

    // background colors for surfaces
    { 'surface-1': 'dark:bg-dark-9 bg-white' },
    { 'surface-2': 'dark:bg-dark-6 bg-gray-1' },
    { 'surface-3': 'dark:bg-dark-3 bg-gray-4' },

    // fill primary colors
    { 'fill-primary-1': 'dark:bg-violet-9 bg-indigo-9' },
    { 'fill-primary-2': 'dark:bg-violet-6 bg-indigo-6' },
    { 'fill-primary-3': 'dark:bg-violet-3 bg-indigo-3' },
  ],
  theme: {
    colors: {
      accent: {
        3: '#FFE5C8',
        6: '#FFDAAE',
        9: '#FFCC91',
      },
      success: '#519C66',
      error: '#CC5F5F',
      background: {
        light: '#F0F0F0',
        dark: 'black',
      },
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
