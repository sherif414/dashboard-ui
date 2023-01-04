<template>
  <form @submit.prevent="handleSubmit" class="h-full w-full grid grid-cols-3 2xl:grid-cols-2 gap-x-8 p2">
    <header class="col-span-full flex items-center gap-x-4">
      <h1 class="typo-lg">Account Settings</h1>
      <Btn :loading="isLoading" class="ml-auto px-6 w-20ch!" type="submit">update</Btn>
      <Btn class="bg-error! dark:bg-error! w-20ch!">cancel</Btn>
    </header>
    <div class="flex flex-col gap-4">
      <TextField label="full name" placeholder="John Doe" v-model="fullName">
        <template #prepend>
          <ICustomers />
        </template>
      </TextField>
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
const auth = useAuthStore()

let fullName = $ref(auth.profile?.full_name)
let email = $ref(auth.profile?.email ?? null)
let phone_number = $ref(auth.profile?.phone_number ?? null)
let address = $ref(auth.profile?.address ?? null)
let state = $ref(auth.profile?.address ?? null)
let country = $ref(auth.profile?.country)
let city = $ref(auth.profile?.city)
let image = $ref<File>()

let isLoading = $ref(false)
async function handleSubmit() {
  isLoading = true

  const error = await auth.updateProfile(
    {
      full_name: fullName,
      email,
      state,
      country,
      city,
      address,
      phone_number,
    },
    image
  )

  useMessage(error ? 'error' : 'success', error?.message ?? 'profile updated')
  isLoading = false
}
</script>
