<template>
  <FlashMessage :variant="messageType" :show="isShowingMessage" :msg="message" />
  <form @submit.prevent="submit" ref="formEl" class="flex flex-col p4 gap-4 min-h-screen">
    <!-- title  -->
    <header class="flex items-center gap-4">
      <h1 class="typo-lg">Create New Products</h1>
      <button
        type="submit"
        class="relative typo-clr-on-primary grid px-4 py-2 rounded-md ml-auto transition-color"
        :class="[isSubmitting ? 'fill-primary-3' : 'fill-primary-2']"
      >
        <span :class="{ invisible: isSubmitting }"> add product </span>
        <ILoading class="w-6 h-6" v-if="isSubmitting" />
      </button>
    </header>
    <div class="grow grid grid-cols-3 gap-x-4">
      <div class="p8 grid grid-cols-2 gap-x-16 col-span-2 rounded-md surface-1 typo-sm">
        <div class="flex flex-col gap-6">
          <!-- product name  -->
          <TextField v-model="formData.name" placeholder="must be at least 3 characters" label="product name">
            <template #prepend>
              <IShoppingBag />
            </template>
          </TextField>

          <!-- category -->
          <ComboBox place-holder="select category" v-model="formData.category" label="category" :options="categories" />

          <!-- pricing -->
          <div class="grid grid-cols-2 gap-4 items-center">
            <TextField v-model="formData.sell_price" type="number" placeholder="0.00" label="sell price">
              <template #prepend>
                <IMoney />
              </template>
            </TextField>
            <TextField v-model="formData.cost_price" type="number" placeholder="0.00" label="cost price">
              <template #prepend>
                <IMoney />
              </template>
            </TextField>
          </div>

          <!-- quantity -->
          <TextField v-model="formData.stock" type="number" placeholder="0.00" label="in stock" />

          <!-- delivery type -->
          <Select
            v-model="formData.delivery_type"
            title="delivery type"
            :options="['home delivery', 'pick up']"
            multiple
          />

          <!-- discount -->
          <div>
            <div class="mb-1">discount</div>
            <div class="grid grid-cols-2 gap-4 items-end">
              <Select v-model="formData.discount_type" title="type" :options="['coupon', 'time limited', 'offer']" />
              <TextField v-model="formData.discount_value" type="number" placeholder="value" />
            </div>
          </div>
        </div>

        <!-- description -->
        <div class="flex flex-col w-full gap-y-4">
          <label class="flex flex-col w-full gap-y-1">
            description
            <textarea
              v-model="formData.description"
              rows="10"
              class="form-input resize-none w-full focus:(outline-indigo-4 outline-2 dark:outline-violet-4)"
              placeholder="short description"
            />
          </label>
          <!-- expiration date -->
          <TextField v-model="formData.expiration_date" type="date" label="expiration date" />
        </div>
      </div>

      <!-- picture upload form  -->
      <div class="p6 rounded-md surface-1 flex flex-col overflow-auto">
        <h3 class="mb-2">images</h3>
        <FileUpload v-model="productImage" />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { definitions } from 'types/supabase'
import { useProductsStore } from '~/store/products'

const categories = ['phone', 'computer', 'laptop', 'clothes', 'shoes', 'accessory', 'gadget']
const store = useProductsStore()
let formEl = $ref<HTMLFormElement | null>(null)

let isSubmitting = $ref(false)
let isShowingMessage = $ref(false)

let message = $ref('')
let messageType = $ref<'success' | 'error'>('success')

let productImage = $ref<File | undefined>()
let formData = $ref<definitions['products']>({
  name: undefined,
  description: undefined,
  published: undefined,
  category: undefined,
  sell_price: undefined,
  cost_price: undefined,
  stock: undefined,
  delivery_type: [],
  discount_type: undefined,
  discount_value: undefined,
  expiration_date: undefined,
})

async function submit() {
  isSubmitting = true
  const res = await store.addProduct(formData, productImage)
  if (!res) {
    message = 'something wrong happened'
    messageType = 'error'
    isShowingMessage = true
    setTimeout(() => {
      isShowingMessage = false
    }, 5000)
  }
  //
  else if (res) {
    message = 'the product was added successfully'
    messageType = 'success'
    isShowingMessage = true
    formEl?.reset()
    setTimeout(() => {
      isShowingMessage = false
    }, 5000)
  }
  isSubmitting = false
}
</script>
