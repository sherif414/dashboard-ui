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
            class="w-8 h-8 rounded-full row-span-2 col-span-1 self-center overflow-hidden object-cover"
            :src="getProfileImageUrl(profile.profile_image)"
            :alt="`${profile.full_name}'s profile image'`"
          />
          <span class="row-span-1 col-span-1 typo-clr-base">
            {{ profile.full_name }}
          </span>
          <div class="flex justify-between items-center gap-x-12">
            <span>{{ profile.email }}</span>
          </div>
        </li>
      </ul>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { watchDebounced } from '@vueuse/core'
import type { Profile } from 'types'
import { useAuthStore } from '~/store/auth'
import { useLoadingOverlay } from '~/composables/LoadingOverlay'
import { useMessage } from '~/composables/message'
import { chatService } from '~/services/chatService'
import { getProfileImageUrl } from '~/services/imageUtils'
import TextField from '~/components/TextField.vue'
import { IAdd, ISearch } from '~/components/icons'

const auth = useAuthStore()
const emit = defineEmits(['close', 'conversationCreated'])
const self = ref<HTMLDialogElement | null>(null)
const container = ref<HTMLElement | null>(null)
const overlay = useLoadingOverlay(container)

const searchValue = ref('')
const isLoading = ref(false)
const searchResult = ref<Profile[] | null>(null)
const errorMsg = ref('')

async function handleCreation(userId: string) {
  errorMsg.value = ''
  overlay.isLoading.value = true

  const currentUserId = auth.user?.id || 'user-demo-admin'
  const newConversation = await chatService.createConversation(currentUserId, userId)

  overlay.isLoading.value = false
  emit('conversationCreated', userId, newConversation.id)
  closeModal()
}

async function getUsers(searchTerm: string): Promise<void> {
  try {
    searchResult.value = await chatService.searchProfiles(searchTerm, auth.user?.id)
  } catch (err: any) {
    useMessage('error', err.message ?? 'an error has happened')
  }
}

watchDebounced(
  searchValue,
  async () => {
    if (!searchValue.value) {
      searchResult.value = null
      return
    }
    isLoading.value = true
    await getUsers(searchValue.value)
    isLoading.value = false
  },
  { debounce: 500 }
)

function closeModal() {
  self.value?.close()
}

function openModal() {
  self.value?.showModal()
}

defineExpose({
  closeModal,
  openModal,
})
</script>
