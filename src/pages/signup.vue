<template>
  <main class="p4 h-screen grid place-items-center">
    <form class="flex flex-col gap-8 surface-1 p8 py-11 rounded-md w-27rem" @submit.prevent="handleSignup">
      <ILogo class="self-center" />
      <div class="flex flex-col gap-2">
        <h1 class="text-center typo-lg last:typo-clr-primary">
          Get started with <em class="typo-clr-primary font-not-oblique">Metrix</em>
        </h1>
        <h2 class="text-center typo-clr-muted typo-sm">create your account</h2>
      </div>
      <div class="flex flex-col">
        <TextField required v-model="name" placeholder="your full name" type="text">
          <template #prepend><ICustomers /></template>
        </TextField>
        <TextField required class="my-5" v-model="email" placeholder="Email Address" type="email">
          <template #prepend><IEmail /></template>
        </TextField>
        <TextField required v-model="password" placeholder="pick a strong password" type="password">
          <template #prepend><ILock /></template>
        </TextField>
      </div>
      <h3 class="self-center">
        already have an account?
        <router-link active-class="" class="typo-clr-primary hover:underline" to="login">login</router-link>
      </h3>
      <Btn :loading="isSubmitting" type="submit" class="mx-auto"> create account </Btn>
    </form>
  </main>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

const auth = useAuthStore()
const router = useRouter()

let isSubmitting = $ref(false)
let name = $ref('')
let email = $ref('')
let password = $ref('')

async function handleSignup() {
  if (email && password) {
    isSubmitting = true
    const error = await auth.signUp(email, password)
    isSubmitting = false
    if (error) {
      useMessage('error', error.message)
    } else {
      router.push('/email-confirmation')
    }
  }
}
</script>
