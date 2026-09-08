import { ref } from 'vue'
import type { Profile, User } from 'types'
import { StorageSerializers, useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { authService } from '~/services/authService'
import { defaultProfile, defaultUser } from '~/services/mock/seedData'

export const useAuthStore = defineStore('main', () => {
  const publicPages = ['/login', '/signup', '/email-confirmation']
  const redirectPath = ref('')

  // Pre-seed with demo user and profile if empty for an instant frictionless showcase
  const user = useLocalStorage<User | null>('user', defaultUser, { serializer: StorageSerializers.object })
  const profile = useLocalStorage<Profile | null>('profile', defaultProfile, { serializer: StorageSerializers.object })

  async function login(email: string, password?: string) {
    const res = await authService.login(email, password)
    if ('error' in res) {
      return res.error
    }
    user.value = res.user
    profile.value = res.profile
    return null
  }

  async function signUp(email: string, password: string, fullName: string) {
    const res = await authService.signUp(email, password, fullName)
    if (res.error) return res.error
    return null
  }

  async function signOut() {
    await authService.signOut()
    user.value = null
    profile.value = null
    return null
  }

  async function getUser() {
    if (!user.value) return null
    return await authService.getUser(user.value.id)
  }

  async function getProfile() {
    if (!user.value) return
    const p = await authService.getProfile(user.value.id)
    if (p) profile.value = p
  }

  async function updateProfile(userProfile: Partial<Profile>, imageFile?: File | null) {
    if (!user.value) return { message: 'Not logged in' }
    const { profile: updated, error } = await authService.updateProfile(user.value.id, userProfile, imageFile)
    if (updated) profile.value = updated
    return error
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    if (!user.value) return { message: 'Not logged in' }
    const res = await authService.changePassword(user.value.id, currentPassword, newPassword)
    if (res.error) return res.error
    if (user.value) {
      user.value.password = newPassword
    }
    return null
  }

  authService.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
      user.value = session?.user ?? null
      getProfile()
    } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
      user.value = null
      profile.value = null
    }
  })

  return { redirectPath, publicPages, getUser, getProfile, updateProfile, signOut, signUp, login, changePassword, profile, user }
})
