import { User } from '@supabase/supabase-js'
import { StorageSerializers, useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { supabase } from '../api'

export const useAuthStore = defineStore('main', () => {
  const publicPages = ['/login', '/signup', '/email-confirmation']
  const redirectPath = ref('')
  const user = useLocalStorage<User | null>('user', null, { serializer: StorageSerializers.object })

  async function login(email: string, password: string) {
    return (await supabase.auth.signInWithPassword({ email, password })).error
  }

  async function signUp(email: string, password: string) {
    return (await supabase.auth.signUp({ email, password })).error
  }

  async function signOut() {
    return (await supabase.auth.signOut()).error
  }

  async function getUser() {
    return (await supabase.auth.getSession()).data.session?.user ?? null
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
      user.value = session?.user ?? null
    }
    if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
      user.value = null
    }
  })

  return { redirectPath, publicPages, getUser, signOut, signUp, login, user }
})
