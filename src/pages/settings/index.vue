<template>
  <main class="flex flex-col p4 lg:p6 overflow-y-auto w-full">
    <section class="grow surface-1 p4 sm:p6 flex flex-col gap-6 rounded-md border border-gray-2 dark:border-dark-3">
      <nav class="inline-flex flex-wrap w-max rounded-md surface-2 text-center gap-1 p-1 border border-gray-2 dark:border-dark-3">
        <RouterLink
          active-class="surface-1 typo-clr-base font-medium shadow-sm"
          to="/settings/personalize"
          class="py-1.5 px-4 rounded transition typo-sm typo-clr-muted hover:typo-clr-base"
        >
          Personalize
        </RouterLink>
        <RouterLink
          active-class="surface-1 typo-clr-base font-medium shadow-sm"
          to="/settings/security"
          class="py-1.5 px-4 rounded transition typo-sm typo-clr-muted hover:typo-clr-base"
        >
          Security
        </RouterLink>
        <RouterLink
          active-class="surface-1 typo-clr-base font-medium shadow-sm"
          to="/settings/edit-info"
          class="py-1.5 px-4 rounded transition typo-sm typo-clr-muted hover:typo-clr-base"
        >
          Profile
        </RouterLink>
      </nav>
      <div class="grow relative">
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
import { ref, onUnmounted } from 'vue'
import { useRouter, RouterLink, RouterView } from 'vue-router'

const router = useRouter()

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
</script>
