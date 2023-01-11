<template>
  <main class="grid grid-rows-[max-content_1fr] grid-cols-3 gap-4 p4">
    <header class="flex items-center gap-4 justify-start col-span-full">
      <h1 class="typo-head">Conversations</h1>
    </header>

    <section class="surface-1 rounded-md pt4 flex flex-col gap-4 overflow-y-auto">
      <h2 class="typo-head mx-4">contacts</h2>

      <!-- search box -->
      <TextField wrapper-class="mx-4" placeholder="search contacts" v-model.noLazy="searchValue">
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
                class="w-8 h-8 rounded-full row-span-2 col-span-1 self-center overflow-hidden"
                src="../../assets/img/profile.jpg"
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
        </template>
      </TextField>

      <!-- conversations list-->
      <div class="relative grow">
        <TransitionGroup
          enter-active-class="delay-200 ease"
          move-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0"
          tag="div"
          class="absolute w-full h-full flex flex-col overflow-y-auto border-t dark:border-dark-3 no-scrollbar"
        >
          <ConversationLink
            v-if="conversations"
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
      <RouterView v-slot="{ Component, route }">
        <KeepAlive :max="5">
          <Component :data="activeConversation" :is="Component" :key="route.path" />
        </KeepAlive>
      </RouterView>
    </template>
    <div v-else class="surface-1 rounded-md col-span-2"></div>
  </main>
</template>

<script setup lang="ts">
import type { Profile, MaybeArray, ConversationWithProfile } from 'types'

const router = useRouter()
const auth = useAuthStore()
const myId = $computed(() => auth.profile?.id ?? '')
let conversations = $ref<ConversationWithProfile[] | null>(null)
let activeConversation = $ref<ConversationWithProfile | null>(null)

async function handleSearchResultClick(userId: string) {
  searchResults = null
  searchValue = ''
  const existingConversation = (
    await supabase.from('conversation_member').select('conversation_id, user_id').eq('user_id', userId).maybeSingle()
  ).data

  // already in conversation with
  if (existingConversation) {
    const idx = conversations?.findIndex(({ id }) => id === existingConversation.conversation_id)
    if (idx !== undefined && idx !== -1) activeConversation = conversations?.splice(idx, 1)[0] ?? activeConversation
    else {
      const res = await getConversationWithProfile({ conversationId: existingConversation.conversation_id })
      if (!Array.isArray(res)) activeConversation = res
    }
    conversations?.unshift(activeConversation!)
    router.push('/chat/' + activeConversation?.id)
  }

  // not in conversation with
  else {
    const newConversation = await createConversation(userId)
    if (!newConversation) return

    if (conversations) {
      conversations.unshift(newConversation)
    } else {
      conversations = [newConversation]
    }
    router.push('/chat/' + newConversation.id)
  }
}

async function createConversation(userId: string): Promise<ConversationWithProfile | null> {
  const { data: newConversation, error } = await supabase
    .from('conversation')
    .insert({ other_member_id: userId })
    .select(`*, created_by_profile:created_by(*), other_member_profile:other_member_id(*)`)
    .maybeSingle()

  if (error || !newConversation) {
    useMessage('error', error?.message ?? 'an error has happened')
    return null
  }

  await supabase
    .from('conversation_member')
    .insert({ user_id: userId, conversation_id: newConversation.id })
    .select()
    .single()

  return newConversation as ConversationWithProfile
}

async function getConversationWithProfile(
  options: { conversationId?: string; from?: number; to?: number } = {}
): Promise<MaybeArray<ConversationWithProfile> | null> {
  if (options.conversationId) {
    const { data } = await supabase
      .from('conversation')
      .select(`*, created_by_profile:created_by(*), other_member_profile:other_member_id(*)`)
      .eq('id', options.conversationId)
      .order('last_message_at', { ascending: false, nullsFirst: false })
      .single()
    return data as ConversationWithProfile
  }

  const { data } = await supabase
    .from('conversation')
    .select(`*, created_by_profile:created_by(*), other_member_profile:other_member_id(*)`)
    .order('last_message_at', { ascending: false })
    .range(options.from ?? 0, options.to ?? 20)

  return data as ConversationWithProfile[]
}

getConversationWithProfile({ from: 0, to: 20 }).then((res) => {
  if (!Array.isArray(res)) return
  conversations = res
  activeConversation = conversations[0]
  if (activeConversation) router.push('/chat/' + activeConversation.id)
})

// search logic
let searchValue = $ref('')
let isSearching = $ref(false)
let searchResults = $ref<Profile[] | null>(null)

async function getProfiles(searchTerm: string): Promise<Profile[] | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .textSearch('full_name', searchTerm.split(' ').join(':*&') + ':*')
    .neq('id', auth.user?.id)
    .limit(10)

  if (error) useMessage('error', error.message ?? 'an error has happened')
  return data
}

watchDebounced(
  $$(searchValue),
  async () => {
    if (!searchValue) return
    isSearching = true
    searchResults = await getProfiles(searchValue)
    isSearching = false
  },
  { debounce: 500 }
)
</script>
