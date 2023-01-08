<template>
  <section class="grid place-items-center h-full">
    <div class="w-300px">
      <ComboBox table-name="customers" v-model="form" label="select option"></ComboBox>
      {{ form }}
    </div>
  </section>
</template>

<script setup lang="ts">
let form = $ref('')
</script>
