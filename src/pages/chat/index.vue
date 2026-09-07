<template>
  <main class="flex flex-col md:grid md:grid-cols-3 gap-4 p4 lg:p6 overflow-hidden h-[calc(100vh-58px)] w-full">
    <section class="surface-1 rounded-md pt4 flex flex-col gap-4 overflow-y-auto border border-gray-2 dark:border-dark-3 md:col-span-1" :class="activeConversation ? 'hidden md:flex' : 'flex'">
      <div class="flex items-center justify-between mx-4">
        <h2 class="typo-head">Contacts</h2>
        <span class="typo-sm typo-clr-muted">{{ conversations.length }} active</span>
      </div>

      <!-- search box -->
      <TextField wrapper-class="mx-4" placeholder="Search contacts..." v-model.noLazy="searchValue">
        <template #prepend>
          <ISearch width="20" height="20" />
        </template>
        <template #append>
          <div :class="isSearching ? 'opacity-100' : 'opacity-0'" class="loading" />
        </template>
        <template #dropdown>
          <ul
            class="absolute z-9 max-h-56 w-full rounded-md overflow-auto divide-y-1 dark:divide-dark-3 surface-2 shadow-md top-115% border border-gray-2 dark:border-dark-3 left-0 hidden [input:active~&]:block [input:focus~&]:block"
            v-if="searchResults?.length"
          >
            <li
              class="p2 grid grid-cols-[max-content_1fr] grid-rows-2 gap-1 gap-x-2 typo-sm typo-clr-muted hover:surface-1 cursor-pointer"
              v-for="profile in searchResults"
              :key="profile.id"
              @click="handleSearchResultClick(profile.id)"
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
        </template>
      </TextField>

      <!-- conversations list-->
      <div class="relative grow min-h-200px">
        <TransitionGroup
          enter-active-class="delay-200 ease"
          move-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0"
          tag="div"
          class="absolute w-full h-full flex flex-col overflow-y-auto border-t dark:border-dark-3 divide-y divide-gray-2 dark:divide-dark-3 no-scrollbar"
        >
          <ConversationLink
            v-for="conversation in conversations"
            @click="activeConversation = conversation"
            :key="conversation.id"
            :last-message-date="conversation.last_message_at"
            :title="
              conversation.created_by !== myId
                ? conversation.created_by_profile?.full_name
                : conversation.other_member_profile?.full_name
            "
            :avatar="
              conversation.created_by !== myId
                ? conversation.created_by_profile?.profile_image
                : conversation.other_member_profile?.profile_image
            "
            :conversationId="conversation.id"
          >
            {{ conversation.last_message_content }}
          </ConversationLink>
        </TransitionGroup>
      </div>
    </section>

    <!-- conversation view -->
    <template v-if="activeConversation">
      <div class="md:col-span-2 flex flex-col h-full overflow-hidden" :class="activeConversation ? 'flex' : 'hidden md:flex'">
        <RouterView v-slot="{ Component, route }">
          <KeepAlive :max="5">
            <Component
              :data="activeConversation"
              :is="Component"
              :key="route.path"
              @back="activeConversation = null"
            />
          </KeepAlive>
        </RouterView>
      </div>
    </template>
    <div v-else class="surface-1 rounded-md border border-gray-2 dark:border-dark-3 col-span-2 hidden md:flex items-center justify-center text-gray-4">
      Select a conversation to begin chatting
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import { watchDebounced } from '@vueuse/core'
import type { Profile, ConversationWithProfile } from 'types'
import { useAuthStore } from '~/store/auth'
import { chatService } from '~/services/chatService'
import { getProfileImageUrl } from '~/services/imageUtils'
import { useMessage } from '~/composables/message'
import TextField from '~/components/TextField.vue'
import ConversationLink from '~/components/ConversationLink.vue'
import { ISearch } from '~/components/icons'

const router = useRouter()
const auth = useAuthStore()
const myId = computed(() => auth.profile?.id || 'user-demo-admin')
const conversations = ref<ConversationWithProfile[]>([])
const activeConversation = ref<ConversationWithProfile | null>(null)

async function loadConversations() {
  const res = await chatService.getConversations(myId.value)
  conversations.value = res
  if (res.length && !activeConversation.value) {
    activeConversation.value = res[0]
    router.push('/chat/' + res[0].id)
  }
}

onMounted(() => {
  loadConversations()
})

async function handleSearchResultClick(userId: string) {
  searchResults.value = null
  searchValue.value = ''

  const existingConversation = await chatService.findExistingConversation(userId, myId.value)

  if (existingConversation) {
    activeConversation.value = existingConversation
    router.push('/chat/' + existingConversation.id)
  } else {
    const newConv = await chatService.createConversation(myId.value, userId)
    conversations.value.unshift(newConv)
    activeConversation.value = newConv
    router.push('/chat/' + newConv.id)
  }
}

// search logic
const searchValue = ref('')
const isSearching = ref(false)
const searchResults = ref<Profile[] | null>(null)

async function getProfiles(searchTerm: string): Promise<Profile[] | null> {
  try {
    return await chatService.searchProfiles(searchTerm, auth.user?.id)
  } catch (err: any) {
    useMessage('error', err.message ?? 'Search error')
    return null
  }
}

watchDebounced(
  searchValue,
  async () => {
    if (!searchValue.value) {
      searchResults.value = null
      return
    }
    isSearching.value = true
    searchResults.value = await getProfiles(searchValue.value)
    isSearching.value = false
  },
  { debounce: 500 }
)
</script>
