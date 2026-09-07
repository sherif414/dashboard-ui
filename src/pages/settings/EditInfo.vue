<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 overflow-y-auto px-4">
    <header class="flex justify-between items-center gap-4">
      <h1 class="typo-lg">Account Settings</h1>
      <Btn :loading="isLoading" type="submit">update</Btn>
    </header>

    <section class="grid grid-cols-3 gap-4">
      <div class="grid grid-cols-2 gap-4">
        <TextField wrapper-class="col-span-2" label="full name" placeholder="John Doe" v-model="fullName">
          <template #prepend>
            <ICustomers />
          </template>
        </TextField>
        <TextField
          wrapper-class="col-span-2"
          label="additional email"
          placeholder="example@email.com"
          v-model="email"
          type="email"
        >
          <template #prepend>
            <IEmail />
          </template>
        </TextField>
        <TextField label="address" placeholder="address" v-model="address">
          <template #prepend>
            <ILocation />
          </template>
        </TextField>
        <TextField label="city" placeholder="city" v-model="city" />
        <TextField wrapper-class="col-span-2" label="phone" placeholder="09x,xxx,xx" v-model="phone_number" type="tel">
          <template #prepend>
            <ICustomers />
          </template>
        </TextField>
        <TextField label="country" placeholder="country" v-model="country" />
        <TextField label="state" placeholder="state" v-model="state" />
      </div>
      <div class="flex flex-col gap-4 items-center pt-5">
        <FileUpload class="w-240px h-240px" v-model="image">
          <div class="bg-indigo-1 dark:bg-inherit rounded-md w-max p-4px">
            <IImg height="48" width="48" class="typo-clr-primary" />
          </div>
          <div>
            <p class="typo-base typo-clr-primary">Upload Image</p>
            <p class="typo-clr-muted">
              File Format <span class="typo-clr-base">jpeg, png, jpg</span> Recommended Size
              <span class="typo-clr-base">240x240</span>
            </p>
          </div>
        </FileUpload>
      </div>
    </section>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/store/auth'
import { useMessage } from '~/composables/message'
import Btn from '~/components/Btn.vue'
import TextField from '~/components/TextField.vue'
import FileUpload from '~/components/FileUpload.vue'
import { ICustomers, IEmail, ILocation, IImg } from '~/components/icons'

const auth = useAuthStore()

const fullName = ref(auth.profile?.full_name ?? '')
const email = ref(auth.profile?.email ?? '')
const phone_number = ref(auth.profile?.phone_number ?? '')
const address = ref(auth.profile?.address ?? '')
const state = ref(auth.profile?.state ?? '')
const country = ref(auth.profile?.country ?? '')
const city = ref(auth.profile?.city ?? '')
const image = ref<File>()

const isLoading = ref(false)

async function handleSubmit() {
  isLoading.value = true

  const error = await auth.updateProfile(
    {
      full_name: fullName.value,
      email: email.value,
      state: state.value,
      country: country.value,
      city: city.value,
      address: address.value,
      phone_number: phone_number.value,
    },
    image.value
  )

  useMessage(error ? 'error' : 'success', error?.message ?? 'Profile updated successfully')
  isLoading.value = false
}
</script>
