<template>
  <main class="h-screen p4 pt-5rem pl-5rem">
    <form @submit.prevent="submit" class="flex flex-col gap-4 h-full">
      <!-- title  -->
      <header class="flex items-center gap-4">
        <h1 class="typo-head">Create New Products</h1>
        <Btn class="ml-auto" type="submit" :loading="isSubmitting"> add product </Btn>
      </header>
      <div class="grow grid grid-cols-3 gap-x-4">
        <div class="p8 grid grid-cols-2 gap-x-16 col-span-2 rounded-md surface-1 typo-sm">
          <div class="flex flex-col gap-6">
            <!-- product name  -->
            <TextField required v-model="formData.name" placeholder="name" label="product name">
              <template #prepend>
                <IShoppingBag />
              </template>
            </TextField>

            <!-- category -->
            <Select v-model="formData.category" label="category" :options="categories">select category</Select>

            <!-- pricing -->
            <div class="grid grid-cols-2 gap-4 items-center">
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
            </div>

            <!-- quantity -->
            <TextField required v-model="formData.stock" type="number" placeholder="0" label="in stock" />

            <!-- delivery type -->
            <Select v-model="formData.delivery_type" :options="['home delivery', 'pick up']">delivery type</Select>
          </div>
          <!-- description -->
          <div class="flex flex-col w-full gap-y-4">
            <label class="flex flex-col w-full gap-y-1">
              description
              <textarea
                required
                v-model.trim.lazy="formData.description"
                rows="10"
                class="form-input resize-none w-full focus:(outline-indigo-4 outline-2 dark:outline-violet-4)"
                placeholder="short description"
              />
            </label>
            <!-- expiration date -->
            <TextField v-model="formData.expiration_date" type="date" label="expiration date" />
            <!-- discount -->
            <div>
              <div class="mb-1">discount</div>
              <div class="grid grid-cols-2 gap-4 items-end">
                <Select v-model="formData.discount_type" :options="['coupon', 'time limited', 'offer']">type</Select>
                <TextField v-model="formData.discount_value" type="number" placeholder="0.00">
                  <template #prepend>
                    <IMoney />
                  </template>
                </TextField>
              </div>
            </div>
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
import { useProductsStore } from '~/store/products'
import { v4 as uuid } from 'uuid'
const categories = ['phone', 'computer', 'laptop', 'clothes', 'shoes', 'accessory', 'gadget']
const store = useProductsStore()

let productImage = $ref<File | undefined>()
let formData = $ref({
  name: undefined,
  description: undefined,
  category: '',
  sell_price: undefined,
  cost_price: undefined,
  stock: undefined,
  delivery_type: [],
  discount_type: [],
  discount_value: undefined,
  expiration_date: undefined,
})

let isSubmitting = $ref(false)
async function submit() {
  isSubmitting = true
  let imageName

  if (productImage) {
    const res = await store.insertImage(productImage, `${uuid()}.${productImage.name.split('.').pop()}`)

    if (res.error) {
      useMessage('error', res.error.message ?? 'an error has ocurred')
      isSubmitting = false
      return
    }
    imageName = res.data.path
  }

  const err = await store.insertProduct({ ...formData, image: imageName })
  useMessage(err ? 'error' : 'success', err ? err.message : 'product was added successfully')
  console.log(err)

  if (!err) {
    resetForm()
  }
  setTimeout(() => {
    isSubmitting = false
  }, 200)
}

function resetForm() {
  formData.name = undefined
  formData.description = undefined
  formData.category = ''
  formData.sell_price = undefined
  formData.cost_price = undefined
  formData.stock = undefined
  formData.delivery_type = []
  formData.discount_type = []
  formData.discount_value = undefined
  formData.expiration_date = undefined
}
</script>
