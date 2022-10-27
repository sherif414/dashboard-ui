<script setup lang="ts"></script>

<template>
  <TheHeader />

  <SideBar />
  <div class="h-screen w-screen relative">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
body{
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  --at-apply: w-6px h-6px;
}

::-webkit-scrollbar-thumb {
  --at-apply: dark:bg-dark-50 bg-gray-4 rounded-full;
}

.dark input {
  color-scheme: dark;
}

.fade-enter-active,
.fade-leave-active{
  --at-apply: transition-opacity duration-300;
}
.fade-enter-from,
.fade-leave-to{
 --at-apply: opacity-0;
}

.slide-left-enter-active,
.slide-left-leave-active{
  --at-apply: transition-all duration-300 absolute w-full h-full;
}
.slide-left-enter-from{
  --at-apply: translate-x-100vw;
}
.slide-left-leave-to{
 --at-apply: translate-x-100vw;
}

.slide-right-enter-active,
.slide-right-leave-active{
  --at-apply: transition-all duration-300 absolute w-full h-full;
}
.slide-right-enter-from{
  --at-apply: translate-x--100vw;
}
.slide-right-leave-to{
 --at-apply: translate-x--100vw;
}

dialog[open] {
    animation: showModal 150ms ease normal;
}
@keyframes showModal{
    from {
        scale: 60%;
    }
    to {
      scale: 100%;
    }
}
</style>
