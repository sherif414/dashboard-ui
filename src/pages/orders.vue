<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(url, key)

const data = supabase.from('countries').select()
</script>

<template>
  <main class="grid place-items-center">
    <div>
      {{ data }}
    </div>
  </main>
</template>

<style scoped>

</style>
