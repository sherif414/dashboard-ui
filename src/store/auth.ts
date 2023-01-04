import { User } from '@supabase/supabase-js'
import type { Profile } from 'types'
import { StorageSerializers, useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { supabase } from '../api'

export const useAuthStore = defineStore('main', () => {
  const publicPages = ['/login', '/signup', '/email-confirmation']
  const redirectPath = ref('')
  const user = useLocalStorage<User | null>('user', null, { serializer: StorageSerializers.object })
  const profile = useLocalStorage<Profile | null>('profile', null, { serializer: StorageSerializers.object })

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
    profile.value = (await supabase.from('profiles').select('*').eq('id', user.value?.id).single()).data ?? null
  }

  async function updateProfile(userProfile: Partial<Profile>, imageFile?: File) {
    let imagePath: string | null = null
    if (imageFile) {
      const { data, error } = await supabase.storage
        .from('profile-image')
        .upload(`${useUUID()}.${imageFile.name.split('.').pop()}`, imageFile)

      if (error) return error
      if (data?.path) imagePath = data.path
    }

    const { error, data } = await supabase
      .from('profiles')
      .update({ ...userProfile, profile_image: imagePath })
      .eq('id', user.value?.id)
      .select()
      .single()
    if (data) profile.value = data
    return error
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
      user.value = session?.user ?? null
      getProfile()
    } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
      user.value = null
      profile.value = null
    }
  })

  return { redirectPath, publicPages, getUser, getProfile, updateProfile, signOut, signUp, login, profile, user }
})
