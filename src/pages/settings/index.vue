<template>
  <main class="flex flex-col p-4">
    <section class="grow surface-1 p-4 flex flex-col gap-4 rounded-md overflow-auto">
      <nav class="relative inline-flex w-max rounded-md surface-2 text-center gap-2 p1">
        <RouterLink
          active-class="typo-clr-base!"
          to="/settings/personalize"
          class="p2 px-4 personalize-link relative z-2 typo-clr-muted"
          >personalize</RouterLink
        >
        <RouterLink
          active-class="typo-clr-base!"
          to="/settings/security"
          class="p2 px-4 security-link relative z-2 typo-clr-muted"
          >security</RouterLink
        >
        <RouterLink
          active-class="typo-clr-base!"
          to="/settings/edit-info"
          class="p2 px-4 edit-info-link relative z-2 typo-clr-muted"
          >profile</RouterLink
        >
        <div
          ref="tabPointer"
          class="surface-1 h-[calc(100%_-_8px)] absolute tab-pointer duration-300 z-1 top-4px rounded-md"
        />
      </nav>
      <div class="grow relative overflow-hidden">
        <RouterView v-slot="{ Component }">
          <Transition :name="transitionName">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watchEffect } from 'vue'
import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'

const router = useRouter()
const route = useRoute()
const tabPointer = ref<HTMLElement | null>(null)

const transitionName = ref<'slide-left' | 'slide-right'>('slide-right')
const removeGuard = router.beforeEach((to, from) => {
  if (from.path === '/settings/security') {
    if (to.path === '/settings/edit-info') transitionName.value = 'slide-right'
    else transitionName.value = 'slide-left'
  } else if (from.path === '/settings/edit-info') {
    transitionName.value = 'slide-left'
  } else {
    transitionName.value = 'slide-right'
  }
})

onUnmounted(removeGuard)

onMounted(() => {
  watchEffect(() => {
    if (!tabPointer.value) return
    if (route.name === 'personalize') {
      const personalize = document.querySelector('.personalize-link') as HTMLElement
      if (personalize) {
        tabPointer.value.style.left = personalize.offsetLeft + 'px'
        tabPointer.value.style.width = personalize.getBoundingClientRect().width + 'px'
      }
    } else if (route.name === 'security') {
      const security = document.querySelector('.security-link') as HTMLElement
      if (security) {
        tabPointer.value.style.left = security.offsetLeft + 'px'
        tabPointer.value.style.width = security.getBoundingClientRect().width + 'px'
      }
    } else if (route.name === 'edit info') {
      const editInfo = document.querySelector('.edit-info-link') as HTMLElement
      if (editInfo) {
        tabPointer.value.style.left = editInfo.offsetLeft + 'px'
        tabPointer.value.style.width = editInfo.getBoundingClientRect().width + 'px'
      }
    }
  })
})
</script>

<style scoped>
.tab-pointer {
  transition-property: left, width;
}
</style>
