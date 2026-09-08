<template>
  <main class="flex flex-col md:grid md:grid-cols-3 gap-4 p-3 sm:p-4 lg:p-6 overflow-hidden h-[calc(100dvh-58px)] md:h-full w-full">
    <section
      class="surface-1 rounded-md pt-4 flex flex-col gap-3 overflow-hidden border border-gray-2 dark:border-dark-3 md:col-span-1 min-w-0"
      :class="activeConversation ? 'hidden md:flex' : 'flex'"
      aria-label="Contacts list"
    >
      <div class="flex items-center justify-between mx-4">
        <h2 class="typo-head typo-clr-base font-semibold">Contacts</h2>
        <span class="typo-sm typo-clr-muted tabular-nums">{{ conversations.length }} active</span>
      </div>

      <!-- search box -->
      <div class="relative mx-4" @focusin="isSearchFocused = true" @focusout="handleSearchFocusOut">
        <TextField
          placeholder="Search contacts..."
          v-model.noLazy="searchValue"
          @keydown.esc="handleSearchEscape"
        >
          <template #prepend>
            <ISearch width="18" height="18" class="typo-clr-muted" />
          </template>
          <template #append>
            <div :class="isSearching ? 'opacity-100' : 'opacity-0'" class="loading" />
          </template>
        </TextField>

        <!-- Dropdown with blur protection -->
        <Transition name="fade">
          <div
            v-if="isSearchFocused && searchValue.trim()"
            @mousedown.prevent
            class="absolute z-30 max-h-56 w-full rounded-md overflow-auto divide-y divide-gray-2 dark:divide-dark-3 surface-2 shadow-lg top-115% border border-gray-2 dark:border-dark-3 left-0"
            role="listbox"
            aria-label="Search results"
          >
            <template v-if="searchResults && searchResults.length > 0">
              <div
                v-for="profile in searchResults"
                :key="profile.id"
                role="option"
                tabindex="0"
                @click="handleSearchResultClick(profile.id)"
                @keydown.enter="handleSearchResultClick(profile.id)"
                class="p-2.5 grid grid-cols-[max-content_1fr] grid-rows-2 gap-1 gap-x-2.5 typo-sm typo-clr-muted hover:surface-1 focus:surface-1 cursor-pointer transition-colors outline-none"
              >
                <img
                  class="w-8 h-8 rounded-full row-span-2 col-span-1 self-center overflow-hidden object-cover border border-gray-2 dark:border-dark-3 shrink-0"
                  :src="getProfileImageUrl(profile.profile_image)"
                  :alt="profile.full_name ? `${profile.full_name}'s profile image` : ''"
                />
                <span class="row-span-1 col-span-1 font-medium typo-clr-base truncate">
                  {{ profile.full_name }}
                </span>
                <span class="row-span-1 col-span-1 text-xs truncate typo-clr-muted">
                  {{ profile.email }}
                </span>
              </div>
            </template>
            <div
              v-else-if="!isSearching"
              class="p-4 text-center typo-sm typo-clr-muted"
            >
              No contacts matching "{{ searchValue }}"
            </div>
          </div>
        </Transition>
      </div>

      <!-- conversations list -->
      <div class="relative grow min-h-200px flex flex-col overflow-hidden">
        <!-- Skeleton loading state -->
        <div
          v-if="isLoadingContacts"
          class="w-full h-full flex flex-col border-t border-gray-2 dark:border-dark-3 divide-y divide-gray-2 dark:divide-dark-3 animate-pulse"
          aria-hidden="true"
        >
          <div v-for="i in 5" :key="i" class="grid grid-cols-[max-content_1fr] p-2 px-3 gap-x-3 mx-2 my-1.5 items-center">
            <div class="w-10 h-10 rounded-full surface-2 shrink-0"></div>
            <div class="flex flex-col gap-2 min-w-0">
              <div class="flex justify-between items-center gap-2">
                <div class="w-24 h-3.5 rounded surface-2"></div>
                <div class="w-10 h-2.5 rounded surface-2"></div>
              </div>
              <div class="w-36 h-2.5 rounded surface-2"></div>
            </div>
          </div>
        </div>

        <div
          v-else-if="conversations.length === 0"
          class="h-full flex flex-col items-center justify-center p-6 text-center text-gray-500 my-auto"
        >
          <ICustomers width="28" height="28" class="mb-2 opacity-50" />
          <p class="font-medium typo-base mb-1 typo-clr-base">No active contacts</p>
          <p class="typo-sm typo-clr-muted max-w-xs">Search above to find team members and begin a chat thread.</p>
        </div>

        <TransitionGroup
          v-else
          enter-active-class="transition-opacity duration-200 ease-out"
          move-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0"
          tag="div"
          class="w-full h-full flex flex-col overflow-y-auto border-t border-gray-2 dark:border-dark-3 divide-y divide-gray-2 dark:divide-dark-3 no-scrollbar"
        >
          <ConversationLink
            v-for="conversation in conversations"
            @click="selectConversation(conversation)"
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
      <div
        class="md:col-span-2 flex flex-col h-full overflow-hidden"
        :class="activeConversation ? 'flex' : 'hidden md:flex'"
      >
        <RouterView v-slot="{ Component, route: currentRoute }">
          <KeepAlive :max="5">
            <Component
              :data="activeConversation"
              :is="Component"
              :key="currentRoute.path"
              @back="handleBack"
            />
          </KeepAlive>
        </RouterView>
      </div>
    </template>
    <div
      v-else-if="isLoadingContacts"
      class="surface-1 rounded-md border border-gray-2 dark:border-dark-3 col-span-2 hidden md:flex flex-col h-full overflow-hidden animate-pulse"
      aria-hidden="true"
    >
      <!-- Skeleton Header -->
      <div class="flex justify-between items-center border-b border-gray-2 dark:border-dark-3 p-3 gap-2">
        <div class="flex gap-2.5 items-center">
          <div class="w-10 h-10 rounded-full surface-2 shrink-0"></div>
          <div class="flex flex-col gap-1.5">
            <div class="w-28 h-4 rounded surface-2"></div>
            <div class="w-14 h-2.5 rounded surface-2"></div>
          </div>
        </div>
        <div class="w-16 h-5 rounded surface-2"></div>
      </div>
      <!-- Skeleton Messages -->
      <div class="grow flex flex-col-reverse gap-4 p-4 sm:p-6 overflow-hidden">
        <div class="w-52 h-10 rounded-2xl rounded-bl-xs surface-2 self-start opacity-70"></div>
        <div class="w-64 h-12 rounded-2xl rounded-br-xs surface-2 self-end opacity-50"></div>
        <div class="w-40 h-9 rounded-2xl rounded-bl-xs surface-2 self-start opacity-60"></div>
      </div>
      <!-- Skeleton Footer -->
      <div class="p-3 border-t border-gray-2 dark:border-dark-3">
        <div class="h-10 rounded-lg surface-2"></div>
      </div>
    </div>
    <div
      v-else
      class="surface-1 rounded-md border border-gray-2 dark:border-dark-3 col-span-2 hidden md:flex flex-col items-center justify-center gap-3 p-8 text-center"
    >
      <div class="w-14 h-14 rounded-full surface-2 border border-gray-2 dark:border-dark-3 flex items-center justify-center typo-clr-muted">
        <ISend width="24" height="24" />
      </div>
      <div class="max-w-xs">
        <p class="typo-head typo-clr-base mb-1 font-semibold">Select a Conversation</p>
        <p class="typo-sm typo-clr-muted">Choose a contact from the list on the left to review recent messages and live customer updates.</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute, RouterView } from 'vue-router'
import { watchDebounced } from '@vueuse/core'
import type { Profile, ConversationWithProfile } from 'types'
import { useAuthStore } from '~/store/auth'
import { chatService } from '~/services/chatService'
import { getProfileImageUrl } from '~/services/imageUtils'
import { useMessage } from '~/composables/message'
import TextField from '~/components/TextField.vue'
import ConversationLink from '~/components/ConversationLink.vue'
import { ISearch, ICustomers, ISend } from '~/components/icons'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const myId = computed(() => auth.profile?.id || 'user-demo-admin')
const conversations = ref<ConversationWithProfile[]>([])
const activeConversation = ref<ConversationWithProfile | null>(null)
const isLoadingContacts = ref(true)

function selectConversation(conv: ConversationWithProfile) {
  activeConversation.value = conv
  router.push('/chat/' + conv.id)
}

function handleBack() {
  activeConversation.value = null
  router.push('/chat')
}

async function loadConversations() {
  isLoadingContacts.value = true
  try {
    const res = await chatService.getConversations(myId.value)
    conversations.value = res

    const currentRouteId = route.params.id as string | undefined
    if (currentRouteId) {
      const matched = res.find((c) => c.id === currentRouteId)
      if (matched) {
        activeConversation.value = matched
        return
      }
    }

    // On desktop, default select the first conversation if none selected
    if (res.length && !activeConversation.value && typeof window !== 'undefined' && window.innerWidth >= 768) {
      activeConversation.value = res[0]
      router.replace('/chat/' + res[0].id)
    }
  } finally {
    isLoadingContacts.value = false
  }
}

watch(
  () => route.params.id,
  (newId) => {
    if (newId && conversations.value.length) {
      const target = conversations.value.find((c) => c.id === newId)
      if (target) activeConversation.value = target
    } else if (!newId) {
      if (conversations.value.length && typeof window !== 'undefined' && window.innerWidth >= 768) {
        activeConversation.value = conversations.value[0]
        router.replace('/chat/' + conversations.value[0].id)
      } else {
        activeConversation.value = null
      }
    }
  }
)

onMounted(() => {
  loadConversations()
})

// Search state
const searchValue = ref('')
const isSearching = ref(false)
const isSearchFocused = ref(false)
const searchResults = ref<Profile[] | null>(null)

function handleSearchFocusOut(e: FocusEvent) {
  const related = e.relatedTarget as HTMLElement | null
  if (!related || !related.closest('[role="listbox"]')) {
    isSearchFocused.value = false
  }
}

function handleSearchEscape() {
  isSearchFocused.value = false
}

async function handleSearchResultClick(userId: string) {
  searchResults.value = null
  searchValue.value = ''
  isSearchFocused.value = false

  const existingConversation = await chatService.findExistingConversation(userId, myId.value)

  if (existingConversation) {
    selectConversation(existingConversation)
  } else {
    const newConv = await chatService.createConversation(myId.value, userId)
    conversations.value.unshift(newConv)
    selectConversation(newConv)
  }
}

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
    const term = searchValue.value.trim()
    if (!term) {
      searchResults.value = null
      return
    }
    isSearching.value = true
    searchResults.value = await getProfiles(term)
    isSearching.value = false
  },
  { debounce: 180 }
)
</script>
