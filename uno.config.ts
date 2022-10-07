import { defineConfig, presetUno, presetWebFonts, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  shortcuts: [
    // components
    { 'summary-icon': 'p2 rounded-3 dark:bg-dark-2 bg-accent-3 box-content' },
    { 'form-input': 'p3 surface-2 rounded-md focus:outline-gray-3 dark:focus:outline-none' },

    // typography - colors
    { 'typo-clr-base': 'dark:text-gray-1 text-gray-9' },
    { 'typo-clr-muted': 'text-gray-4' },
    { 'typo-clr-disabled': 'dark:text-gray-7 text-gray-3' },
    { 'typo-clr-on-primary': 'text-gray-1' },
    //typography - sizes
    { 'typo-sm': 'text-3' },
    { 'typo-base': 'text-0.875rem' },
    { 'typo-head': 'text-4 font-medium' },
    { 'typo-lg': 'text-5 font-bold' },

    // background colors - surfaces
    { 'surface-1': 'dark:bg-dark-9 bg-white' },
    { 'surface-2': 'dark:bg-dark-6 bg-gray-1' },
    { 'surface-3': 'dark:bg-dark-3 bg-gray-1' },

    // background colors - primary
    { 'fill-primary-1': 'dark:bg-violet-9 bg-indigo-9' },
    { 'fill-primary-2': 'dark:bg-violet-6 bg-indigo-6' },
    { 'fill-primary-3': 'dark:bg-violet-3 bg-indigo-3' },
  ],
  theme: {
    colors: {
      success: '#2DD881',
      error: '#e63946',
      warn: '#fb8500',
      accent: {
        3: '#FFE5C8',
        6: '#FFDAAE',
        9: '#FFCC91',
      },
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
