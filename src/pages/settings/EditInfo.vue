<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 overflow-y-auto px-4">
    <header class="flex justify-between items-center gap-4">
      <h1 class="typo-lg">Account Settings</h1>
      <Btn :loading="isLoading" type="submit">update</Btn>
    </header>

    <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-2">
        <TextField wrapper-class="col-span-1 sm:col-span-2" label="Full Name" placeholder="John Doe" v-model="fullName">
          <template #prepend>
            <ICustomers />
          </template>
        </TextField>
        <TextField
          wrapper-class="col-span-1 sm:col-span-2"
          label="Additional Email"
          placeholder="example@email.com"
          v-model="email"
          type="email"
        >
          <template #prepend>
            <IEmail />
          </template>
        </TextField>
        <TextField label="Address" placeholder="123 Main St" v-model="address">
          <template #prepend>
            <ILocation />
          </template>
        </TextField>
        <TextField label="City" placeholder="San Francisco" v-model="city" />
        <TextField wrapper-class="col-span-1 sm:col-span-2" label="Phone" placeholder="+1 (555) 000-0000" v-model="phone_number" type="tel">
          <template #prepend>
            <ICustomers />
          </template>
        </TextField>
        <TextField label="Country" placeholder="United States" v-model="country" />
        <TextField label="State / Province" placeholder="California" v-model="state" />
      </div>
      <div class="flex flex-col gap-4 items-center justify-center p-6 surface-2 rounded-md border border-gray-2 dark:border-dark-3 lg:col-span-1">
        <FileUpload class="w-full max-w-240px h-240px" v-model="image">
          <div class="bg-indigo-1 dark:bg-inherit rounded-md w-max p-4px">
            <IImg height="48" width="48" class="typo-clr-primary" />
          </div>
          <div>
            <p class="typo-base typo-clr-primary font-medium">Upload Image</p>
            <p class="typo-clr-muted text-xs mt-1">
              File Format <span class="typo-clr-base">jpeg, png, jpg</span><br />Recommended Size
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
