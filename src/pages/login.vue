<template>
  <main class="p4 pt-5rem h-screen grid place-items-center">
    <form class="flex flex-col gap-8 surface-1 p8 py-11 rounded-md w-27rem" @submit.prevent="handleLogin">
      <ILogo class="self-center" />
      <div class="flex flex-col gap-2">
        <h1 class="text-center typo-lg">welcome back!</h1>
        <h2 class="text-center typo-clr-muted typo-sm">login to your account</h2>
      </div>
      <div class="flex flex-col">
        <TextField class="mb-4" required v-model="formData.email" placeholder="Email Address" type="email">
          <template #prepend><IEmail /></template>
        </TextField>
        <TextField required v-model="formData.password" placeholder="password" type="password">
          <template #prepend><ILock /></template>
        </TextField>
        <router-link to="login" active-class="" class="self-end typo-clr-primary hover:underline"
          >Recover Password</router-link
        >
      </div>
      <h3 class="self-center">
        don't have an account?
        <router-link active-class="" class="typo-clr-primary hover:underline" to="signup">signup</router-link>
      </h3>
      <button type="submit" class="self-center px-8 py-2 fill-primary-2 rounded-md typo-clr-on-primary">login</button>
    </form>
  </main>
</template>

<script setup lang="ts">
let formData = ref({
  email: undefined,
  password: undefined,
})

function handleLogin() {}
</script>
