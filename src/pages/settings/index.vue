<template>
  <main class="grid p-4">
    <section class="surface-1 p-8 flex flex-col rounded-md">
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
          class="surface-1 h-[calc(100%_-_8px)] absolute tab-pointer duration-300 z-1 w-3rem top-4px rounded-md"
        />
      </nav>
      <div class="grow relative overflow-hidden">
        <RouterView v-slot="{ Component }">
          <Transition :name="transitionName">
            <Component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const tabPointer = $ref<HTMLElement | null>(null)

let transitionName = $ref<'slide-left' | 'slide-right'>('slide-right')
const removeGuard = router.beforeEach((to, from) => {
  if (from.path === '/settings/security') {
    if (to.path === '/settings/edit-info') transitionName = 'slide-right'
    else transitionName = 'slide-left'
  }
  //
  else if (from.path === '/settings/edit-info') transitionName = 'slide-left'
  else transitionName = 'slide-right'
})

onUnmounted(removeGuard)

onMounted(() => {
  watchEffect(() => {
    if (!tabPointer) return
    //
    else if (route.name === 'personalize') {
      const personalize = document.querySelector('.personalize-link') as HTMLElement
      tabPointer.style.left = personalize.offsetLeft + 'px'
      tabPointer.style.width = personalize.getBoundingClientRect().width + 'px'
    }
    //
    else if (route.name === 'security') {
      const security = document.querySelector('.security-link') as HTMLElement
      tabPointer.style.left = security.offsetLeft + 'px'
      tabPointer.style.width = security.getBoundingClientRect().width + 'px'
    }
    //
    else if (route.name === 'edit info') {
      const editInfo = document.querySelector('.edit-info-link') as HTMLElement
      tabPointer.style.left = editInfo.offsetLeft + 'px'
      tabPointer.style.width = editInfo.getBoundingClientRect().width + 'px'
    }
  })
})
</script>

<style scoped>
.tab-pointer {
  transition-property: left, width;
}
</style>
