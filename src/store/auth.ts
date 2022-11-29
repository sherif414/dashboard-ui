import { User } from '@supabase/supabase-js'
import type { Profile } from 'types'
import { StorageSerializers, useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { supabase } from '../api'

export const useAuthStore = defineStore('main', () => {
  const publicPages = ['/login', '/signup', '/email-confirmation']
  const redirectPath = ref('')
  const user = useLocalStorage<User | null>('user', null, { serializer: StorageSerializers.object })
  const profile = ref<Profile | null>(null)

  async function login(email: string, password: string) {
    return (await supabase.auth.signInWithPassword({ email, password })).error
  }

  async function signUp(email: string, password: string, fullName: string) {
    return (await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })).error
  }

  async function signOut() {
    return (await supabase.auth.signOut()).error
  }

  async function getUser() {
    return (await supabase.auth.getUser()).data.user ?? null
  }

  async function getProfile() {
    profile.value = (await supabase.from('profiles').select('*')).data?.[0] ?? null
  }

  async function updateProfile({
    id = 'leave empty',
    full_name,
    profile_image,
    city,
    country,
    state,
    email,
    address,
    phone_number,
  }: Profile) {
    const { error } = await supabase
      .from('profiles')
      .update({ full_name, city, state, address, phone_number, country, profile_image, email })
      .eq('id', user.value?.id)
    return error
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
      user.value = session?.user ?? null
      getProfile()
    }
    if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
      user.value = null
    }
  })

  return { redirectPath, publicPages, getUser, getProfile, updateProfile, signOut, signUp, login, profile, user }
})
