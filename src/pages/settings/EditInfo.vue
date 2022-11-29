<template>
  <form @submit.prevent="handleSubmit" class="h-full w-full grid grid-cols-3 2xl:grid-cols-2 gap-x-8 p2">
    <header class="col-span-full flex items-center gap-x-4">
      <h1 class="typo-lg">Account Settings</h1>
      <Btn :loading="isLoading" class="ml-auto px-6 w-20ch!" type="submit">update</Btn>
      <Btn class="bg-error! dark:bg-error! w-20ch!">cancel</Btn>
    </header>
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4 items-center">
        <TextField label="first name" placeholder="John" v-model="firstName">
          <template #prepend>
            <ICustomers />
          </template>
        </TextField>
        <TextField label="last name" placeholder="Doe" v-model="lastName">
          <template #prepend>
            <ICustomers />
          </template>
        </TextField>
      </div>
      <TextField label="additional email" placeholder="example@email.com" v-model="email" type="email">
        <template #prepend>
          <IEmail />
        </template>
      </TextField>
      <TextField label="phone" placeholder="09x,xxx,xx" v-model="phone_number" type="tel">
        <template #prepend>
          <ICustomers />
        </template>
      </TextField>
    </div>
    <div class="flex flex-col gap-4">
      <TextField label="address" placeholder="address" v-model="address">
        <template #prepend>
          <ILocation />
        </template>
      </TextField>
      <TextField label="city" placeholder="city" v-model="city" />
      <div class="grid grid-cols-2 gap-4">
        <TextField label="country" placeholder="country" v-model="country" />
        <TextField label="state" placeholder="state" v-model="state" />
      </div>
    </div>
    <div class="pt-4 flex mx-auto 2xl:col-span-2">
      <FileUpload v-model="image" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

const auth = useAuthStore()

let firstName = $ref('')
let lastName = $ref('')
let full_name = $computed(() => firstName + ' ' + lastName)
let email = $ref('')
let phone_number = $ref<number | null>(null)
let address = $ref('')
let state = $ref('')
let country = $ref('')
let city = $ref('')
let image = $ref<File>()

let isLoading = $ref(false)
async function handleSubmit() {
  isLoading = true
  const res = await auth.updateProfile({
    full_name,
    email,
    state,
    country,
    city,
    address,
    phone_number,
    profile_image: image?.name ?? null,
    id: '',
  })

  useMessage(res ? 'error' : 'success', res?.message ?? 'profile updated')
  isLoading = false
}
</script>
