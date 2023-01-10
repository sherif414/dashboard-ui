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
