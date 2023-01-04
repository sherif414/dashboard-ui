<template>
  <dialog
    @close="emit('close')"
    @cancel="emit('close')"
    ref="self"
    class="open:backdrop:backdrop-blur-4 rounded-md p4 surface-1 typo-clr-base typo-base"
  >
    <div ref="container" class="flex flex-col gap-4 relative min-w-20rem">
      <h1 class="typo-head">New Conversation</h1>
      <IAdd @click="closeModal" class="absolute top-0 right-0 cursor-pointer rotate-45" />

      <!-- search bar -->
      <span v-if="errorMsg" class="text-center text-error">{{ errorMsg }}</span>
      <TextField placeholder="search users" v-model.noLazy="searchValue">
        <template #prepend>
          <ISearch width="20" height="20" />
        </template>
        <template #append>
          <div :class="isLoading ? 'opacity-100' : 'opacity-0'" class="loading" />
        </template>
      </TextField>

      <!-- search results -->
      <ul class="max-h-25rem overflow-auto divide-y-1 dark:divide-dark-3" v-if="searchResult?.length">
        <li
          class="p2 grid grid-cols-[max-content_1fr] grid-rows-2 gap-1 gap-x-2 typo-sm typo-clr-muted hover:surface-2 cursor-pointer"
          v-for="profile in searchResult"
          :key="profile.id"
          @click="handleCreation(profile.id)"
        >
          <img
            class="w-8 h-8 rounded-full row-span-2 col-span-1 self-center overflow-hidden"
            src="../assets/img/profile.jpg"
            :alt="`${profile.full_name}'s profile image'`"
          />
          <span class="row-span-1 col-span-1 typo-clr-base">
            {{ profile.full_name }}
          </span>
          <div class="flex justify-between items-center gap-x-12">
            <span>Last activity</span>
            <span>2 days ago</span>
          </div>
        </li>
      </ul>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import type { Profile } from 'types'

const auth = useAuthStore()
const emit = defineEmits(['close', 'conversationCreated'])
const self = $ref<HTMLDialogElement | null>(null)
const container = $ref<HTMLElement | null>(null)
const overlay = useLoadingOverlay($$(container))

let searchValue = $ref('')
let isLoading = $ref(false)
let searchResult = $ref<Pick<Profile, 'id' | 'full_name' | 'profile_image'>[] | null>(null)
let errorMsg = $ref('')

async function handleCreation(userId: string) {
  errorMsg = ''
  overlay.isLoading.value = true
  const { data: newConversation, error } = await supabase
    .from('conversation')
    .insert({ name: 'new conversation' })
    .select()
    .single()

  if (error) {
    overlay.isLoading.value = false
    errorMsg = error.message ?? 'an error has happened'
    return
  }
  if (!newConversation) {
    overlay.isLoading.value = false
    errorMsg = 'an error has happened'
    return
  }

  await supabase
    .from('conversation_member')
    .insert({ user_id: userId, conversation_id: newConversation.id })
    .select()
    .single()

  overlay.isLoading.value = false
  emit('conversationCreated', userId, newConversation.id)
}

async function getUsers(searchTerm: string): Promise<void> {
  let _searchTerm = searchTerm.split(' ').join(':*&') + ':*'
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, profile_image')
    .textSearch('full_name', _searchTerm)
    .neq('id', auth.user?.id)
    .limit(10)
  console.log(data)

  searchResult = data
  if (error) useMessage('error', error.message ?? 'an error has happened')
}

watchDebounced(
  $$(searchValue),
  async () => {
    if (!searchValue) return
    isLoading = true
    await getUsers(searchValue)
    isLoading = false
  },
  { debounce: 500 }
)

function closeModal() {
  self?.close()
}

function openModal() {
  self?.showModal()
}

defineExpose({
  closeModal,
  openModal,
})
</script>
