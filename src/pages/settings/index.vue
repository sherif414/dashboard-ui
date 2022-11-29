<template>
  <main class="h-screen grid p-1.5rem pt-5.5rem pl-5.5rem">
    <section class="surface-1 p-8 flex flex-col rounded-md">
      <nav class="grid grid-cols-12 text-center gap-4">
        <RouterLink
          exact-active-class="border-b-3 border-b-indigo-4 dark:border-b-violet-4"
          active-class=""
          to="/settings/personalize"
          class="p1"
          >personalize</RouterLink
        >
        <RouterLink
          exact-active-class="border-b-3  border-b-indigo-4 dark:border-b-violet-4"
          active-class=""
          to="/settings/security"
          class="p1"
          >security</RouterLink
        >
        <RouterLink
          exact-active-class="border-b-3  border-b-indigo-4 dark:border-b-violet-4"
          active-class=""
          to="/settings/edit-info"
          class="p1"
          >edit info</RouterLink
        >
      </nav>
      <div class="grow relative overflow-hidden p2">
        <RouterView v-slot="{ Component, route }">
          <Transition :name="route.meta.transition ?? transitionName">
            <Component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const router = useRouter()

let transitionName = $ref<'slide-left' | 'slide-right'>('slide-right')
router.beforeEach((to, from) => {
  if (from.path === '/settings/security') {
    if (to.path === '/settings/edit-info') transitionName = 'slide-left'
    else if (to.path === '/settings/personalize') transitionName = 'slide-right'
  }
})
</script>
