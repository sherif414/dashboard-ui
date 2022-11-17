import { defineStore } from 'pinia'
// import { supabase } from '../api'

export const useAuthStore = defineStore('main', () => {
  const isLogged = ref(false)
  return { isLogged }
})
