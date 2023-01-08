<template>
  <dialog
    class="open:backdrop:backdrop-blur-4 rounded-md px-6 surface-1 typo-clr-base typo-base shadow-md dark:border dark:border-dark-3"
    ref="target"
  >
    <!-- dialog header -->
    <div class="my-2">
      <h2 class="typo-head mb-4">Create New Order</h2>
    </div>
    <form @submit.prevent="handleSubmit" class="grid grid-cols-2 gap-8">
      <!-- dialog order form-->
      <div class="grid grid-cols-2 gap-x-2 gap-y-4 min-w-20rem">
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
          rows="6"
          v-model.trim.lazy="formData.orderNote"
        />
      </div>

      <!-- dialog order items -->
      <section class="flex flex-col gap-y-4 pt-18px">
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
                  class="w-8 h-8 rounded-full row-span-2 col-span-1 self-center overflow-hidden"
                  src="src/assets/img/iphone14.png"
                  :alt="`${product.name}'s profile image'`"
                />
                <span class="row-span-1 col-span-1 typo-clr-base">
                  {{ product.name }}
                </span>
                <div class="flex justify-between items-center gap-x-12">
                  <span>Last activity</span>
                  <span>2 days ago</span>
                </div>
              </li>
            </ul>
          </template>
        </TextField>

        <div v-if="true" class="grow relative">
          <ul
            class="flex flex-col typo-sm divide-y divide-gray-2 dark:divide-dark-3 w-full h-full absolute top-0 left-0 overflow-y-auto"
          >
            <!-- order item -->
            <li
              v-for="(item, idx) in orderItems"
              :key="idx"
              class="grid grid-cols-[max-content_max-content_1fr] grid-rows-2 gap-x-2 gap-y-1 items-center p2"
            >
              <img class="w-12 h-12 row-span-2" src="../assets/img/iphone14.png" alt="product image" />
              <h3>{{ item.product.name ?? '-' }}</h3>
              <button type="button" @click="orderItems.delete(item)" class="justify-self-end text-error">remove</button>
              <span>{{ item.product.sell_price ?? '-' }}</span>
              <div class="justify-self-end flex gap-3 items-center">
                <IMinus
                  v-show="item.quantity > 1"
                  @click="item.quantity--"
                  class="box-content py-1 px-2 surface-2 rounded-lg cursor-pointer"
                  width="12"
                  height="12"
                />
                {{ item.quantity }}
                <IAdd
                  @click="item.quantity++"
                  class="box-content py-1 px-2 surface-2 rounded-lg cursor-pointer"
                  width="12"
                  height="12"
                />
              </div>
            </li>
          </ul>
        </div>

        <!-- empty state -->
        <div v-else class="grid grow place-content-center gap-8">
          <IShoppingBag
            width="56"
            height="56"
            class="surface-2 [&_path]:stroke-gray-4 stroke-width-2 p-8 box-content rounded-full mx-auto"
          />
          <h3 class="typo-head">Add Products To Your Order</h3>
        </div>
      </section>

      <!-- dialog submission -->
      <Btn type="button" variant="text" class="justify-self-end" @click="target?.close()">cancel</Btn>
      <Btn :loading="isSubmitting" :disabled="!orderItems.size" type="submit">Create Order</Btn>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import type { Product, OrderItem } from 'types'

const emits = defineEmits(['success'])
let customer = $ref<{ id?: number; name?: string }>({})
let formData = $ref({
  paymentType: '',
  orderType: '',
  orderStatus: '',
  orderDate: '',
  orderNote: '',
})
let orderItems = $ref<Set<{ product: Product; quantity: number }>>(new Set())

const target = $ref<HTMLDialogElement | null>(null)
const openModal = () => {
  target?.showModal()
}

// insert order
let isSubmitting = $ref(false)
async function handleSubmit() {
  if (!orderItems.size || !customer.id) return
  isSubmitting = true

  const orderRes = await supabase
    .from('orders')
    .insert({
      status: formData.orderStatus,
      note: formData.orderNote,
      type: formData.orderType,
      created_at: formData.orderDate ?? undefined,
      owner: +customer.id,
      total_purchases: getTotalPrice(),
    })
    .select()
    .single()

  if (orderRes.error) {
    useMessage('error', orderRes.error.message ?? 'an error has occurred')
    isSubmitting = false
    return
  }

  const orderItemsRes = await supabase.from('order_item').insert(getOrderItems(orderRes.data.id, orderRes.data.status))

  if (orderItemsRes.error) {
    useMessage('error', orderItemsRes.error.message ?? 'an error has occurred')
    isSubmitting = false
    return
  }

  isSubmitting = false
  useMessage('success', 'order was added')
  emits('success')
  target?.close()
}

function getTotalPrice() {
  let totalPrice = 0
  orderItems.forEach((item) => {
    totalPrice += (item.product.sell_price ?? 0) * item.quantity
  })
  return totalPrice
}

function getOrderItems(orderId: number, orderStatus: string | null) {
  let _orderItems: Omit<OrderItem, 'created_at'>[] = []

  orderItems.forEach((item) => {
    _orderItems.push({
      order_id: orderId,
      product_id: item.product.id,
      quantity: item.quantity,
      discount: null,
      status: orderStatus,
    })
  })

  return _orderItems
}

// search
let isSearching = $ref(false)
let searchResults = $ref<Product[] | null>(null)
let searchValue = $ref('')

async function getProducts(searchTerm: string): Promise<Product[] | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .textSearch('name', searchTerm.split(' ').join(':*&') + ':*')
    .limit(10)

  if (error) useMessage('error', error.message ?? 'an error has happened')
  return data
}

watchDebounced(
  $$(searchValue),
  async () => {
    if (!searchValue) return
    isSearching = true
    searchResults = await getProducts(searchValue)
    isSearching = false
  },
  { debounce: 500 }
)

// order items
function handleSearchResultClick(product: Product) {
  let alreadyExists = false

  orderItems.forEach((item) => {
    if (item.product.id === product.id) {
      alreadyExists = true
      return
    }
  })

  if (alreadyExists) return

  orderItems.add({
    product: product,
    quantity: 1,
  })
}

defineExpose({
  openModal,
})
</script>
