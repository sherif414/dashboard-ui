import { defineConfig, presetUno, presetWebFonts, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  shortcuts: [
    // components
    {
      overlay: 'w-full h-full absolute place-items-center grid bg-opacity-60 dark:bg-opacity-80 surface-1 z-99',
    },
    { 'summary-icon': 'p2 rounded-3 bg-amber-100/70 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 box-content' },

    // typography - colors
    { 'typo-clr-base': 'text-gray-900 dark:text-gray-100' },
    { 'typo-clr-muted': 'text-gray-500 dark:text-gray-400' },
    { 'typo-clr-disabled': 'text-gray-400 dark:text-gray-600' },
    { 'typo-clr-on-primary': 'text-white' },
    { 'typo-clr-primary': 'text-indigo-600 dark:text-violet-400' },
    // typography - sizes
    { 'typo-sm': 'text-3' },
    { 'typo-base': 'text-0.875rem' },
    { 'typo-head': 'text-4 font-medium' },
    { 'typo-lg': 'text-5 font-bold' },

    // background colors - surfaces
    { 'surface-canvas': 'bg-[#f4f5f7] dark:bg-[#121214]' },
    { 'surface-1': 'bg-white dark:bg-[#1a1b20]' },
    { 'surface-2': 'bg-[#f0f2f5] dark:bg-[#24262e]' },
    { 'surface-3': 'bg-white dark:bg-[#2c2e38]' },

    // background colors - primary
    { 'fill-primary-1': 'bg-indigo-700 dark:bg-violet-700' },
    { 'fill-primary-2': 'bg-indigo-600 dark:bg-violet-600' },
    { 'fill-primary-3': 'bg-indigo-500 dark:bg-violet-500' },
  ],

  safelist: ['hidden!', 'overlay', 'surface-canvas'],
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
        light: '#f4f5f7',
        dark: '#121214',
      },
      dark: {
        1: '#121214',
        2: '#1a1b20',
        3: '#2a2b32',
        4: '#24262e',
        5: '#2c2e38',
      },
    },
  },

  presets: [
    presetUno(),
    presetWebFonts({
      fonts: {
        sans: 'Roboto:400,700',
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
