<template>
  <main class="p4 lg:p6 overflow-y-auto w-full">
    <form @submit.prevent="submit" class="flex flex-col gap-6 h-full w-full">
      <!-- Header with back navigation & actions -->
      <header class="flex flex-wrap gap-4 items-center justify-between surface-1 p4 sm:p-5 rounded-md border border-gray-2 dark:border-dark-3">
        <div class="flex items-center gap-3">
          <RouterLink
            to="/products"
            class="typo-sm typo-clr-muted hover:typo-clr-base flex items-center gap-1 transition"
          >
            ← Products
          </RouterLink>
          <h1 class="typo-head font-bold">Create New Product</h1>
        </div>
        <div class="flex items-center gap-3 ml-auto">
          <RouterLink
            to="/products"
            class="px-4 py-2 rounded-lg text-xs font-semibold typo-clr-muted hover:typo-clr-base transition"
          >
            Cancel
          </RouterLink>
          <Btn type="submit" :loading="isSubmitting">Add Product</Btn>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
        <!-- Form Left Column: Chunked Sections -->
        <div class="p-6 sm:p-8 flex flex-col gap-6 lg:col-span-2 rounded-md surface-1 typo-sm border border-gray-2 dark:border-dark-3">
          <!-- Section 1: General Info -->
          <div>
            <h2 class="text-base font-semibold typo-clr-base mb-3">General Information</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                required
                minlength="3"
                v-model="formData.name"
                placeholder="e.g. Wireless Noise-Cancelling Headphones"
                label="Product Name"
                class="sm:col-span-2"
              >
                <template #prepend>
                  <IShoppingBag />
                </template>
              </TextField>

              <Select v-model="formData.category" :options="categories" placeholder="Select category">
                Category
              </Select>

              <Select v-model="formData.delivery_type" :options="['home delivery', 'pick up']" placeholder="Select delivery">
                Delivery Type
              </Select>
            </div>
          </div>

          <!-- Section 2: Pricing & Inventory -->
          <div class="pt-4 border-t border-gray-2 dark:border-dark-3">
            <h2 class="text-base font-semibold typo-clr-base mb-3">Pricing & Inventory</h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TextField required v-model="formData.sell_price" type="number" step="0.01" min="0" placeholder="0.00" label="Selling Price ($)">
                <template #prepend>
                  <IMoney />
                </template>
              </TextField>
              <TextField required v-model="formData.cost_price" type="number" step="0.01" min="0" placeholder="0.00" label="Cost Price ($)">
                <template #prepend>
                  <IMoney />
                </template>
              </TextField>
              <TextField required v-model="formData.stock" type="number" min="0" placeholder="0" label="Units In Stock" />
            </div>
          </div>

          <!-- Section 3: Description -->
          <div class="pt-4 border-t border-gray-2 dark:border-dark-3">
            <h2 class="text-base font-semibold typo-clr-base mb-3">Description</h2>
            <label class="flex flex-col w-full gap-y-1">
              <span class="font-medium typo-clr-muted text-xs">Product Details & Specifications</span>
              <textarea
                required
                v-model.trim.lazy="formData.description"
                rows="5"
                class="surface-2 p4 rounded-md outline-none outline-offset-0! resize-none w-full focus:(outline-indigo-4 outline-2 dark:outline-violet)"
                placeholder="Enter key technical specifications, dimensions, warranty, and compatibility..."
              />
            </label>
          </div>

          <!-- Section 4: Promotional Discount (Optional) -->
          <div class="pt-4 border-t border-gray-2 dark:border-dark-3">
            <h2 class="text-base font-semibold typo-clr-base mb-3">Promotional Discount (Optional)</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                v-model="formData.discount_type"
                placeholder="Discount Type"
                :options="['None', 'Percentage Off', 'Fixed Discount', 'Seasonal Promo']"
              >
                Discount Type
              </Select>
              <TextField
                v-model="formData.discount_value"
                type="number"
                min="0"
                placeholder="0.00"
                label="Discount Value"
              >
                <template #prepend>
                  <IMoney />
                </template>
              </TextField>
            </div>
          </div>
        </div>

        <!-- Picture upload form  -->
        <div class="p-6 rounded-md surface-1 flex flex-col overflow-auto border border-gray-2 dark:border-dark-3 lg:col-span-1">
          <h2 class="typo-head mb-3 font-semibold">Product Image</h2>
          <FileUpload v-model="productImage" />
        </div>
      </div>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useProductsStore } from '~/store/products'
import { useMessage } from '~/composables/message'
import { useUUID } from '~/composables/uuid'
import TextField from '~/components/TextField.vue'
import Select from '~/components/Select.vue'
import FileUpload from '~/components/FileUpload.vue'
import Btn from '~/components/Btn.vue'
import { IShoppingBag, IMoney } from '~/components/icons'

const router = useRouter()
const categories = ['Gadgets', 'Laptops', 'Audio', 'Wearables', 'Tablets', 'Accessories', 'Displays']
const store = useProductsStore()

const productImage = ref<File | undefined>()
const formData = ref<{
  name?: string
  description?: string
  category: string
  sell_price?: number
  cost_price?: number
  stock?: number
  delivery_type: string | string[]
  discount_type: string
  discount_value?: number
  expiration_date?: string
}>({
  name: undefined,
  description: undefined,
  category: 'Gadgets',
  sell_price: undefined,
  cost_price: undefined,
  stock: undefined,
  delivery_type: ['home delivery'],
  discount_type: 'None',
  discount_value: undefined,
  expiration_date: undefined,
})

const isSubmitting = ref(false)

async function submit() {
  isSubmitting.value = true
  let imageName: string | undefined

  if (productImage.value) {
    const res = await store.insertImage(productImage.value, `${useUUID()}.${productImage.value.name.split('.').pop()}`)

    if (res.error) {
      useMessage('error', 'An error occurred uploading image')
      isSubmitting.value = false
      return
    }
    imageName = res.data.path
  }

  const err = await store.insertProduct({
    ...formData.value,
    delivery_type: Array.isArray(formData.value.delivery_type) ? formData.value.delivery_type : [formData.value.delivery_type],
    image: imageName,
  })

  useMessage(err ? 'error' : 'success', err ? err.message : 'Product was created successfully!')

  if (!err) {
    resetForm()
    await store.getCount()
    setTimeout(() => {
      router.push('/products')
    }, 400)
  }
  setTimeout(() => {
    isSubmitting.value = false
  }, 200)
}

function resetForm() {
  formData.value.name = undefined
  formData.value.description = undefined
  formData.value.category = 'Gadgets'
  formData.value.sell_price = undefined
  formData.value.cost_price = undefined
  formData.value.stock = undefined
  formData.value.delivery_type = ['home delivery']
  formData.value.discount_type = 'None'
  formData.value.discount_value = undefined
  formData.value.expiration_date = undefined
  productImage.value = undefined
}
</script>
