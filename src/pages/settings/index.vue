<template>
  <main class="flex flex-col p4 lg:p6 overflow-y-auto w-full">
    <section class="grow surface-1 p4 sm:p6 flex flex-col gap-6 rounded-md border border-gray-2 dark:border-dark-3">
      <nav
        role="tablist"
        aria-label="Settings tabs"
        class="inline-flex flex-wrap w-max max-w-full rounded-md surface-2 text-center gap-1 p-1 border border-gray-2 dark:border-dark-3"
      >
        <RouterLink
          v-for="tab in tabs"
          :key="tab.path"
          :to="tab.path"
          role="tab"
          :id="`tab-${tab.id}`"
          :aria-selected="route.path === tab.path"
          aria-controls="settings-tabpanel"
          active-class="surface-1 typo-clr-base font-medium shadow-sm"
          class="py-1.5 px-4 rounded transition typo-sm typo-clr-muted hover:typo-clr-base focus:outline-none focus-visible:(ring-2 ring-offset-1 ring-indigo-5 dark:ring-violet-5)"
        >
          {{ tab.label }}
        </RouterLink>
      </nav>
      <div id="settings-tabpanel" role="tabpanel" class="grow relative min-h-350px">
        <RouterView v-slot="{ Component }">
          <Transition name="settings-fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useRoute, RouterLink, RouterView } from 'vue-router'

const route = useRoute()

const tabs = [
  { id: 'profile', label: 'Profile', path: '/settings/edit-info' },
  { id: 'personalize', label: 'Personalize', path: '/settings/personalize' },
  { id: 'security', label: 'Security', path: '/settings/security' },
]
</script>

<style scoped>
.settings-fade-enter-active,
.settings-fade-leave-active {
  transition: opacity 0.18s ease-out, transform 0.18s ease-out;
}
.settings-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.settings-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
