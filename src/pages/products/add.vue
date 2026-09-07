<template>
  <main class="p4">
    <form @submit.prevent="submit" class="flex flex-col gap-4 h-full">
      <!-- title  -->
      <header class="flex items-center gap-4">
        <h1 class="typo-head">Create New Product</h1>
        <Btn class="ml-auto" type="submit" :loading="isSubmitting"> add product </Btn>
      </header>
      <div class="grow grid grid-cols-3 gap-x-4">
        <div class="p8 grid grid-cols-2 gap-x-16 col-span-2 rounded-md surface-1 typo-sm">
          <div class="flex flex-col gap-6">
            <!-- product name  -->
            <TextField
              required
              minlength="3"
              v-model="formData.name"
              placeholder="must be at least 3 characters"
              label="product name"
            >
              <template #prepend>
                <IShoppingBag />
              </template>
            </TextField>

            <!-- category -->
            <Select v-model="formData.category" :options="categories" placeholder="Select category">category</Select>

            <!-- pricing -->
            <fieldset class="grid grid-cols-2 gap-4 items-center">
              <legend class="sr-only">price</legend>
              <TextField required v-model="formData.sell_price" type="number" placeholder="0.00" label="sell price">
                <template #prepend>
                  <IMoney />
                </template>
              </TextField>
              <TextField required v-model="formData.cost_price" type="number" placeholder="0.00" label="cost price">
                <template #prepend>
                  <IMoney />
                </template>
              </TextField>
            </fieldset>

            <!-- quantity -->
            <TextField required v-model="formData.stock" type="number" placeholder="0" label="in stock" />

            <!-- delivery type -->
            <Select v-model="formData.delivery_type" :options="['home delivery', 'pick up']" placeholder="Select delivery">delivery type</Select>
          </div>
          <!-- description -->
          <div class="flex flex-col w-full gap-y-4">
            <label class="flex flex-col w-full gap-y-1">
              description
              <textarea
                required
                v-model.trim.lazy="formData.description"
                rows="10"
                class="surface-2 p4 rounded-md outline-none outline-offset-0! resize-none w-full focus:(outline-indigo-4 outline-2 dark:outline-violet)"
                placeholder="short description"
              />
            </label>
            <!-- expiration date -->
            <TextField v-model="formData.expiration_date" type="date" label="expiration date" />
            <!-- discount -->
            <fieldset class="grid grid-cols-2 gap-4 items-end">
              <legend class="mb-1 col-span-2">discount</legend>
              <Select
                v-model="formData.discount_type"
                placeholder="type"
                :options="['coupon', 'time limited', 'offer']"
              />
              <TextField v-model="formData.discount_value" type="number" placeholder="0.00">
                <template #prepend>
                  <IMoney />
                </template>
              </TextField>
            </fieldset>
          </div>
        </div>
        <!-- picture upload form  -->
        <div class="p6 rounded-md surface-1 flex flex-col overflow-auto">
          <h3 class="mb-2">images</h3>
          <FileUpload v-model="productImage" />
        </div>
      </div>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
  discount_type: '',
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

  useMessage(err ? 'error' : 'success', err ? err.message : 'Product was added successfully!')

  if (!err) {
    resetForm()
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
  formData.value.category = ''
  formData.value.sell_price = undefined
  formData.value.cost_price = undefined
  formData.value.stock = undefined
  formData.value.delivery_type = []
  formData.value.discount_type = ''
  formData.value.discount_value = undefined
  formData.value.expiration_date = undefined
  productImage.value = undefined
}
</script>
