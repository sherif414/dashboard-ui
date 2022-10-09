<template>
  <div class="flex flex-col p4 gap-4 min-h-screen">
    <!-- title  -->
    <header class="flex items-center gap-4">
      <h1 class="typo-lg">create a product</h1>
      <button class="ml-auto">save as draft</button>
      <button class="fill-primary-2 typo-clr-on-primary px-4 py-2 rounded-md">save & publish</button>
    </header>
    <main class="grow grid grid-cols-3 gap-x-4">
      <!-- main form -->
      <div class="p8 grid grid-cols-2 gap-x-16 col-span-2 rounded-md surface-1 typo-sm">
        <!-- left side -->
        <div class="flex flex-col gap-6">
          <label class="flex flex-col w-full gap-y-1">
            product name
            <input type="text" placeholder="muse be at least 3 characters" class="form-input" required />
          </label>

          <ComboBox place-holder="select category" v-model="categoryValue" label="category" :options="categorys" />
          <div class="grid grid-cols-2 gap-4">
            <input type="number" placeholder="selling price" class="form-input" />
            <input type="number" placeholder="cost price" class="form-input" />
          </div>
          <label class="flex flex-col w-full gap-y-1">
            quantity
            <input type="number" placeholder="in stock" class="form-input" />
          </label>
          <Select title="order type" :options="['delivary', 'pick up', 'all']" />

          <div>
            <div class="mb-1">discount</div>
            <div class="grid grid-cols-2 gap-4">
              <Select title="type" :options="['coupon', 'time limited', 'offer']" />
              <input class="form-input" type="number" placeholder="value" />
            </div>
          </div>
        </div>

        <!-- right side -->
        <div class="flex flex-col w-full gap-y-4">
          <label class="flex flex-col w-full gap-y-1">
            description
            <textarea rows="10" class="form-input resize-none w-full" placeholder="short description" />
          </label>
          <label class="flex flex-col w-full gap-y-1">
            expiration date
            <div class="grid grid-cols-2 gap-x-6">
              <input type="date" class="form-input" />
              <input type="time" class="form-input" />
            </div>
          </label>
        </div>
      </div>

      <!-- picture form  -->
      <div class="p4 rounded-md surface-1 flex flex-col gap-y-4 overflow-auto">
        <n-upload :max="5">
          <n-upload-dragger>
            <div style="margin-bottom: 12px">
              <n-icon size="48" :depth="3">
                <IUpload />
              </n-icon>
            </div>
            <n-text style="font-size: 16px"> Click or drag a file to this area to upload </n-text>
            <n-p depth="3" style="margin: 8px 0 0 0">
              Strictly prohibit from uploading sensitive information. For example, your bank card PIN or your credit
              card expiry date.
            </n-p>
          </n-upload-dragger>
        </n-upload>

        <span class="mt-2">additional images</span>
        <n-upload :theme-overrides="uploadOverrides" v-model:file-list="files" list-type="image-card">
          Click to Upload
        </n-upload>
        <div>
          {{ files }}
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { UploadFileInfo, UploadProps } from 'naive-ui'

let categoryValue = $ref()
let files = $ref<UploadFileInfo[]>()

let uploadOverrides: NonNullable<UploadProps['themeOverrides']> = {}

const categorys = ['phone', 'computer', 'laptop', 'clothes', 'shoes', 'accessory', 'gadget']
</script>
