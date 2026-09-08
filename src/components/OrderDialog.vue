<template>
  <dialog
    class="open:backdrop:backdrop-blur-4 rounded-md p-4 sm:p-6 surface-1 typo-clr-base typo-base shadow-xl border border-gray-2 dark:border-dark-3 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
    ref="target"
  >
    <!-- dialog header -->
    <div class="my-2 flex items-center justify-between pb-2 border-b border-gray-2 dark:border-dark-3">
      <h2 class="typo-head">Create New Order</h2>
      <button
        type="button"
        aria-label="Close dialog"
        class="typo-clr-muted hover:typo-clr-base text-lg font-bold p-1 leading-none cursor-pointer transition"
        @click="target?.close()"
      >
        ✕
      </button>
    </div>
    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
      <!-- dialog order form-->
      <div class="grid grid-cols-2 gap-x-3 gap-y-4">
        <ComboBox table-name="customers" class="col-span-2" v-model="customer" placeholder="customer" />
        <Select :options="['cash', 'credit card']" v-model="formData.paymentType" placeholder="Payment Type"></Select>
        <Select :options="['delivery', 'pickup']" v-model="formData.orderType" placeholder="Order Type"></Select>
        <TextField label="order date" wrapper-class="col-span-2" v-model="formData.orderDate" type="date" />
        <Select :options="['pending', 'completed']" v-model="formData.orderStatus" class="col-span-2"
          >select status</Select
        >
        <textarea
          placeholder="add a note"
          class="col-span-2 resize-none surface-2 p4 rounded-md outline-none outline-offset-0! focus:(outline-indigo-4 outline-2 dark:outline-violet)"
          rows="5"
          v-model.trim.lazy="formData.orderNote"
        />
      </div>

      <!-- dialog order items -->
      <section class="flex flex-col gap-y-4">
        <TextField placeholder="search products" v-model.noLazy="searchValue">
          <template #prepend>
            <ISearch width="20" height="20" />
          </template>
          <template #append>
            <div :class="isSearching ? 'opacity-100' : 'opacity-0'" class="loading" />
          </template>
          <template #dropdown>
            <ul
              class="absolute z-9 max-h-56 w-full rounded-md overflow-auto divide-y-1 dark:divide-dark-3 surface-2 shadow-md top-115% border border-gray-2 dark:border-dark-3 left-0 hidden [input:active~&]:block [input:focus~&]:block"
              v-if="searchResults?.length"
            >
              <li
                class="p2 grid grid-cols-[max-content_1fr] grid-rows-2 gap-1 gap-x-2 typo-sm typo-clr-muted hover:surface-1 cursor-pointer"
                v-for="product in searchResults"
                :key="product.id"
                @click="handleSearchResultClick(product)"
              >
                <img
                  class="w-8 h-8 rounded-full row-span-2 col-span-1 self-center overflow-hidden object-cover"
                  :src="getProductImageUrl(product.image)"
                  :alt="`${product.name}'s image'`"
                />
                <span class="row-span-1 col-span-1 typo-clr-base">
                  {{ product.name }}
                </span>
                <div class="flex justify-between items-center gap-x-12">
                  <span>Price: ${{ product.sell_price }}</span>
                  <span>Stock: {{ product.stock }}</span>
                </div>
              </li>
            </ul>
          </template>
        </TextField>

        <div v-if="orderItemsList.length" class="grow relative min-h-40">
          <TransitionGroup
            name="list"
            tag="ul"
            class="flex flex-col typo-sm divide-y divide-gray-2 dark:divide-dark-3 w-full h-full max-h-60 overflow-y-auto"
          >
            <!-- order item -->
            <li
              v-for="(item, idx) in orderItemsList"
              :key="item.product.id ?? idx"
              class="grid grid-cols-[max-content_max-content_1fr] grid-rows-2 gap-x-2 gap-y-1 items-center p2 transition-all duration-200"
            >
              <img class="w-12 h-12 row-span-2 object-cover rounded" :src="getProductImageUrl(item.product.image)" alt="product image" />
              <h3>{{ item.product.name ?? '-' }}</h3>
              <button type="button" @click="removeItem(item)" class="justify-self-end text-error hover:underline active:scale-95 transition cursor-pointer">remove</button>
              <span>${{ item.product.sell_price ?? '-' }}</span>
              <div class="justify-self-end flex gap-3 items-center">
                <IMinus
                  @click="item.quantity > 1 ? item.quantity-- : removeItem(item)"
                  class="box-content py-1 px-2 surface-2 hover:surface-3 active:scale-90 transition rounded-lg cursor-pointer"
                  width="12"
                  height="12"
                />
                <span class="typo-base">{{ item.quantity }}</span>
                <IAdd
                  @click="item.quantity++"
                  class="box-content py-1 px-2 surface-2 hover:surface-3 active:scale-90 transition rounded-lg cursor-pointer"
                  width="12"
                  height="12"
                />
              </div>
            </li>
          </TransitionGroup>
        </div>

        <!-- empty state -->
        <div v-else class="grid grow place-content-center gap-4 py-8">
          <IShoppingBag
            width="48"
            height="48"
            class="surface-2 [&_path]:stroke-gray-4 stroke-width-2 p-6 box-content rounded-full mx-auto"
          />
          <h3 class="typo-head text-center">Add Products To Your Order</h3>
        </div>
      </section>

      <!-- dialog submission -->
      <div class="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-2 dark:border-dark-3">
        <Btn type="button" variant="text" @click="target?.close()">cancel</Btn>
        <Btn :loading="isSubmitting" :disabled="!orderItemsList.length" type="submit">Create Order</Btn>
      </div>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { watchDebounced } from '@vueuse/core'
import type { Product } from 'types'
import ComboBox from '~/components/ComboBox.vue'
import Select from '~/components/Select.vue'
import TextField from '~/components/TextField.vue'
import Btn from '~/components/Btn.vue'
import { ISearch, IMinus, IAdd, IShoppingBag } from '~/components/icons'
import { orderService } from '~/services/orderService'
import { productService } from '~/services/productService'
import { getProductImageUrl } from '~/services/imageUtils'
import { useMessage } from '~/composables/message'

const emits = defineEmits(['success'])
const customer = ref<{ id?: number; name?: string } | null>(null)
const formData = ref({
  paymentType: '',
  orderType: '',
  orderStatus: 'pending',
  orderDate: new Date().toISOString().split('T')[0],
  orderNote: '',
})

interface SelectedOrderItem {
  product: Product
  quantity: number
}

const orderItemsList = ref<SelectedOrderItem[]>([])

const target = ref<HTMLDialogElement | null>(null)
const openModal = () => {
  target.value?.showModal()
}

function removeItem(item: SelectedOrderItem) {
  orderItemsList.value = orderItemsList.value.filter((i) => i.product.id !== item.product.id)
}

// insert order
const isSubmitting = ref(false)
async function handleSubmit() {
  if (!orderItemsList.value.length || !customer.value?.id) {
    useMessage('error', 'Please select a customer and at least one product')
    return
  }
  isSubmitting.value = true

  const total = getTotalPrice()
  const items = orderItemsList.value.map((item) => ({
    product_id: item.product.id,
    quantity: item.quantity,
    discount: null,
    status: formData.value.orderStatus,
  }))

  const res = await orderService.createOrder(
    {
      owner: +customer.value.id,
      type: formData.value.orderType || 'delivery',
      status: formData.value.orderStatus || 'pending',
      note: formData.value.orderNote,
      created_at: formData.value.orderDate ? new Date(formData.value.orderDate).toISOString() : new Date().toISOString(),
      total_purchases: total,
    },
    items
  )

  isSubmitting.value = false

  if (res.error) {
    useMessage('error', res.error.message ?? 'an error has occurred')
    return
  }

  useMessage('success', 'order was added successfully!')
  emits('success')
  orderItemsList.value = []
  target.value?.close()
}

function getTotalPrice() {
  return orderItemsList.value.reduce((total, item) => {
    return total + (item.product.sell_price ?? 0) * item.quantity
  }, 0)
}

// search
const isSearching = ref(false)
const searchResults = ref<Product[] | null>(null)
const searchValue = ref('')

watchDebounced(
  searchValue,
  async () => {
    if (!searchValue.value) {
      searchResults.value = null
      return
    }
    isSearching.value = true
    searchResults.value = await productService.searchProducts(searchValue.value)
    isSearching.value = false
  },
  { debounce: 500 }
)

// order items
function handleSearchResultClick(product: Product) {
  const existing = orderItemsList.value.find((item) => item.product.id === product.id)
  if (existing) {
    existing.quantity++
  } else {
    orderItemsList.value.push({
      product,
      quantity: 1,
    })
  }
  searchValue.value = ''
  searchResults.value = null
}

defineExpose({
  openModal,
})
</script>
