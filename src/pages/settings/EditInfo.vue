<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-6 overflow-y-auto px-4 max-w-900px">
    <header class="flex justify-between items-center gap-4">
      <div>
        <h1 class="typo-lg">Profile & Account Settings</h1>
        <p class="typo-clr-muted text-sm mt-1">Manage your public information, contact details, and avatar.</p>
      </div>
      <Btn :loading="isLoading" :disabled="!isDirty" type="submit" class="hidden sm:inline-flex">
        Save Changes
      </Btn>
    </header>

    <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-2">
        <TextField
          wrapper-class="col-span-1 sm:col-span-2"
          label="Full Name"
          placeholder="John Doe"
          v-model="fullName"
          :disabled="isLoading"
          required
        >
          <template #prepend>
            <ICustomers />
          </template>
        </TextField>
        <TextField
          wrapper-class="col-span-1 sm:col-span-2"
          label="Email Address"
          placeholder="example@email.com"
          v-model="email"
          type="email"
          :disabled="isLoading"
          required
        >
          <template #prepend>
            <IEmail />
          </template>
        </TextField>
        <TextField
          label="Address"
          placeholder="123 Main St"
          v-model="address"
          :disabled="isLoading"
        >
          <template #prepend>
            <ILocation />
          </template>
        </TextField>
        <TextField
          label="City"
          placeholder="San Francisco"
          v-model="city"
          :disabled="isLoading"
        />
        <TextField
          wrapper-class="col-span-1 sm:col-span-2"
          label="Phone Number"
          placeholder="+1 (555) 000-0000"
          v-model="phone_number"
          type="tel"
          :disabled="isLoading"
        >
          <template #prepend>
            <ICustomers />
          </template>
        </TextField>
        <TextField
          label="Country"
          placeholder="United States"
          v-model="country"
          :disabled="isLoading"
        />
        <TextField
          label="State / Province"
          placeholder="California"
          v-model="state"
          :disabled="isLoading"
        />
      </div>
      <div class="flex flex-col gap-4 items-center justify-center p-6 surface-2 rounded-md border border-gray-2 dark:border-dark-3 lg:col-span-1">
        <FileUpload
          class="w-full max-w-240px"
          v-model="image"
          :initial-url="initialAvatarUrl"
          :alt="fullName ? `${fullName}'s avatar` : 'Profile avatar'"
        >
          <div class="bg-indigo-1 dark:bg-dark-2 rounded-md w-max p-4px">
            <IImg height="48" width="48" class="typo-clr-primary" />
          </div>
          <div>
            <p class="typo-base typo-clr-primary font-medium">Upload Avatar</p>
            <p class="typo-clr-muted text-xs mt-1">
              File Format <span class="typo-clr-base">jpeg, png, jpg</span><br />Recommended Size
              <span class="typo-clr-base">240x240 (1:1)</span>
            </p>
          </div>
        </FileUpload>
      </div>
    </section>

    <!-- Bottom Action Bar (visible on all screens, especially crucial on mobile) -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-2 dark:border-dark-3 mt-2">
      <p class="text-xs typo-clr-muted">
        <span v-if="isDirty" class="text-amber-600 dark:text-amber-400 font-medium">● Unsaved changes</span>
        <span v-else>All profile changes are up to date</span>
      </p>
      <div class="flex gap-3">
        <Btn
          v-if="isDirty"
          variant="text"
          type="button"
          @click="resetForm"
          :disabled="isLoading"
        >
          Discard
        </Btn>
        <Btn
          :loading="isLoading"
          :disabled="!isDirty"
          type="submit"
        >
          Save Changes
        </Btn>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '~/store/auth'
import { useMessage } from '~/composables/message'
import { getProfileImageUrl } from '~/services/imageUtils'
import Btn from '~/components/Btn.vue'
import TextField from '~/components/TextField.vue'
import FileUpload from '~/components/FileUpload.vue'
import { ICustomers, IEmail, ILocation, IImg } from '~/components/icons'

const auth = useAuthStore()

const initialAvatarUrl = computed(() => getProfileImageUrl(auth.profile?.profile_image))

const fullName = ref(auth.profile?.full_name ?? '')
const email = ref(auth.profile?.email ?? '')
const phone_number = ref(auth.profile?.phone_number ?? '')
const address = ref(auth.profile?.address ?? '')
const state = ref(auth.profile?.state ?? '')
const country = ref(auth.profile?.country ?? '')
const city = ref(auth.profile?.city ?? '')
const image = ref<File>()

const isLoading = ref(false)

const isDirty = computed(() => {
  return (
    image.value !== undefined ||
    fullName.value !== (auth.profile?.full_name ?? '') ||
    email.value !== (auth.profile?.email ?? '') ||
    phone_number.value !== (auth.profile?.phone_number ?? '') ||
    address.value !== (auth.profile?.address ?? '') ||
    state.value !== (auth.profile?.state ?? '') ||
    country.value !== (auth.profile?.country ?? '') ||
    city.value !== (auth.profile?.city ?? '')
  )
})

function resetForm() {
  fullName.value = auth.profile?.full_name ?? ''
  email.value = auth.profile?.email ?? ''
  phone_number.value = auth.profile?.phone_number ?? ''
  address.value = auth.profile?.address ?? ''
  state.value = auth.profile?.state ?? ''
  country.value = auth.profile?.country ?? ''
  city.value = auth.profile?.city ?? ''
  image.value = undefined
}

async function handleSubmit() {
  if (!fullName.value.trim()) {
    useMessage('warn', 'Full Name is required')
    return
  }
  if (!email.value.trim()) {
    useMessage('warn', 'Email Address is required')
    return
  }

  isLoading.value = true

  const error = await auth.updateProfile(
    {
      full_name: fullName.value.trim(),
      email: email.value.trim(),
      state: state.value.trim(),
      country: country.value.trim(),
      city: city.value.trim(),
      address: address.value.trim(),
      phone_number: String(phone_number.value ?? '').trim(),
    },
    image.value
  )

  isLoading.value = false

  if (error) {
    useMessage('error', error.message ?? 'Failed to update profile')
  } else {
    useMessage('success', 'Profile updated successfully')
    image.value = undefined
  }
}
</script>
