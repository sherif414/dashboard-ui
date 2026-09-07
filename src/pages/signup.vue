<template>
  <main class="p4 h-screen grid place-items-center">
    <form class="flex flex-col gap-8 surface-1 p8 py-11 rounded-md w-27rem" @submit.prevent="handleSignup">
      <ILogo width="100" height="100" class="mx-auto" />
      <div class="flex flex-col gap-2">
        <h1 class="text-center typo-lg last:typo-clr-primary">
          Get started with <em class="typo-clr-primary font-not-oblique">Metrix</em>
        </h1>
        <h2 class="text-center typo-clr-muted typo-sm">create your account</h2>
      </div>
      <div class="flex flex-col">
        <TextField required v-model="fullName" placeholder="your full name" type="text">
          <template #prepend><ICustomers /></template>
        </TextField>
        <TextField required wrapper-class="my-5" v-model="email" placeholder="Email Address" type="email">
          <template #prepend><IEmail /></template>
        </TextField>
        <TextField minlength="6" required v-model="password" placeholder="pick a strong password" type="password">
          <template #prepend><ILock /></template>
        </TextField>
      </div>
      <h3 class="self-center typo-sm">
        already have an account?
        <router-link active-class="" class="typo-clr-primary hover:underline ml-1" to="/login">login</router-link>
      </h3>
      <Btn :loading="isSubmitting" type="submit" class="mx-auto"> create account </Btn>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/store/auth'
import { useMessage } from '~/composables/message'
import TextField from '~/components/TextField.vue'
import Btn from '~/components/Btn.vue'
import { ILogo, ICustomers, IEmail, ILock } from '~/components/icons'

const auth = useAuthStore()
const router = useRouter()

const isSubmitting = ref(false)
const fullName = ref('')
const email = ref('')
const password = ref('')

async function handleSignup() {
  if (email.value && password.value && fullName.value) {
    isSubmitting.value = true
    const error = await auth.signUp(email.value, password.value, fullName.value)
    isSubmitting.value = false
    if (error) {
      useMessage('error', error.message)
    } else {
      useMessage('success', 'Account created! Welcome.')
      router.push('/')
    }
  }
}
</script>
