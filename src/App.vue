<script setup lang="ts">
import { GlobalThemeOverrides, NConfigProvider } from 'naive-ui'

const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: 'rgb(79, 70, 229)',
  },
  Input: {
    color: 'rgb(243, 244, 246)',
    colorFocus: 'none',
    borderFocus: 'none',
    borderHover: 'none',
  },
  Upload: {
    draggerColor: 'rgb(243, 244, 246)', //gray-1
  },
}

const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: 'rgb(124, 58, 237)',
  },
  Input: {
    colorFocus: '',
    border: 'none',
    caretColor: 'none',
    color: 'var(--n-primary-color)',
    borderFocus: 'none',
    borderHover: 'none',
  },
  Upload: {
    draggerColor: ' rgb(28, 28, 30)', // dark-6
  },
}

const theme = null
// ...
</script>

<template>
  <NConfigProvider :theme="theme" :theme-overrides="isDark ? darkThemeOverrides : lightThemeOverrides">
    <!-- <Header /> -->

    <SideBar />
    <div class="pl-4rem">
      <RouterView />
    </div>
  </NConfigProvider>
</template>

<style>
body{
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  --at-apply: w-6px;
}
::-webkit-scrollbar-thumb {
  --at-apply: dark:bg-dark-50 bg-gray-3 rounded-full;
}

.dark input {
  color-scheme: dark;
}
</style>
