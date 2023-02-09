<template>
  <main class="p4 h-screen grid place-items-center">
    <form class="flex flex-col gap-8 surface-1 p8 py-11 rounded-md w-27rem" @submit.prevent="handleLogin">
      <!-- header -->
      <ILogo class="self-center" />
      <div class="flex flex-col gap-2">
        <h1 class="text-center typo-lg">welcome back!</h1>
        <h2 class="text-center typo-clr-muted typo-sm">login to your account</h2>
      </div>

      <!-- form -->
      <div class="flex flex-col">
        <TextField wrapper-class="mb-5" required v-model="email" placeholder="Email Address" type="email">
          <template #prepend><IEmail /></template>
        </TextField>
        <TextField required v-model="password" placeholder="password" type="password">
          <template #prepend><ILock /></template>
        </TextField>
        <router-link to="login" active-class="" class="self-end typo-clr-primary hover:underline"
          >Recover Password</router-link
        >
      </div>

      <!-- footer -->
      <h3 class="self-center">
        don't have an account?
        <router-link active-class="" class="typo-clr-primary hover:underline" to="signup">signup</router-link>
      </h3>
      <Btn type="submit" class="mx-auto" :loading="isSubmitting">login</Btn>
    </form>
  </main>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

const auth = useAuthStore()
const router = useRouter()

let email = $ref('admin@admin.com')
let password = $ref('password')

let isSubmitting = $ref(false)
async function handleLogin() {
  if (email && password) {
    isSubmitting = true
    const error = await auth.login(email, password)
    isSubmitting = false

    if (!error) {
      email = ''
      password = ''
      useMessage('success', 'you are logged in')
      router.push(auth.redirectPath ? auth.redirectPath : '/')
    } else {
      useMessage('error', error.message)
    }
  }
}
</script>
