<template>
  <form @submit.prevent="" class="flex flex-col p4 gap-4 min-h-screen">
    <!-- title  -->
    <header class="flex items-center gap-4">
      <h1 class="typo-lg">create a product</h1>
      <button class="ml-auto">save as draft</button>
      <button type="submit" class="fill-primary-2 typo-clr-on-primary px-4 py-2 rounded-md">save & publish</button>
    </header>
    <div class="grow grid grid-cols-3 gap-x-4">
      <!-- main form -->
      <div class="p8 grid grid-cols-2 gap-x-16 col-span-2 rounded-md surface-1 typo-sm">
        <!-- left side -->
        <div class="flex flex-col gap-6">
          <label class="flex flex-col w-full gap-y-1">
            product name
            <input
              v-model="formData.productName"
              type="text"
              required
              placeholder="muse be at least 3 characters"
              class="form-input"
            />
          </label>

          <ComboBox place-holder="select category" v-model="formData.category" label="category" :options="categorys" />
          <div class="grid grid-cols-2 gap-4">
            <input required v-model="formData.sellPrice" type="number" placeholder="selling price" class="form-input" />
            <input required v-model="formData.costPrice" type="number" placeholder="cost price" class="form-input" />
          </div>

          <label class="flex flex-col w-full gap-y-1">
            quantity
            <input required v-model="formData.quantity" type="number" placeholder="in stock" class="form-input" />
          </label>
          <Select required v-model="formData.orderType" title="order type" :options="['delivary', 'pick up', 'all']" />

          <div>
            <div class="mb-1">discount</div>
            <div class="grid grid-cols-2 gap-4">
              <Select
                required
                v-model="formData.discountType"
                title="type"
                :options="['coupon', 'time limited', 'offer']"
              />
              <input required v-model="formData.discount" class="form-input" type="number" placeholder="value" />
            </div>
          </div>
        </div>

        <!-- right side -->
        <div class="flex flex-col w-full gap-y-4">
          <label class="flex flex-col w-full gap-y-1">
            description
            <textarea
              v-model="formData.description"
              rows="10"
              required
              class="form-input resize-none w-full"
              placeholder="short description"
            />
          </label>

          <label class="flex flex-col w-full gap-y-1">
            expiration date
            <div class="grid grid-cols-2 gap-x-6">
              <input required v-model="formData.expirationDate" type="date" class="form-input" />
              <input required v-model="formData.expirationTime" type="time" class="form-input" />
            </div>
          </label>
        </div>
      </div>

      <!-- picture form  -->
      <div class="p4 rounded-md surface-1 flex flex-col gap-y-4 overflow-auto">
        <n-upload
          required
          @change="
            ({ file }) => {
              file.status = 'finished'
            }
          "
          v-model:file-list="formData.image"
          list-type="image"
        >
          <n-upload-dragger class="typo-sm">
            <div>
              <IUpload height="48" width="48" class="mx-auto typo-clr-muted my-6" />
            </div>
            <p>Click or drag a file to this area to upload</p>
            <p class="typo-clr-muted">
              Strictly prohibit from uploading sensitive information. For example, your bank card PIN or your credit
              card expiry date.
            </p>
          </n-upload-dragger>
        </n-upload>

        <span class="mt-2">additional images</span>
        <n-upload
          @change="
            ({ file }) => {
              file.status = 'finished'
            }
          "
          class="typo-sm p2"
          :theme-overrides="uploadOverrides"
          v-model:file-list="formData.additionalImages"
          list-type="image-card"
        >
          Upload img
        </n-upload>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { UploadFileInfo, UploadProps } from 'naive-ui'

let formData = $ref<{
  productName: string
  category?: string
  sellPrice?: number
  costPrice?: number
  quantity?: number
  orderType?: string
  discountType?: string
  discount?: number
  description?: string
  expirationDate?: string
  expirationTime?: string
  image?: UploadFileInfo[]
  additionalImages?: UploadFileInfo[]
}>({
  productName: '',
  category: '',
  description: '',
  discountType: '',
  expirationDate: '',
  expirationTime: '',
  orderType: '',
})

let uploadOverrides: NonNullable<UploadProps['themeOverrides']> = {}
const categorys = ['phone', 'computer', 'laptop', 'clothes', 'shoes', 'accessory', 'gadget']

// functions
</script>
