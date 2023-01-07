<template>
  <td v-if="variant === 'text'" class="p2 px-4">{{ value || '-' }}</td>

  <td v-else-if="variant === 'link' && to" class="p2 px-4">
    <RouterLink class="hover:underline flex gap-2 items-center" :to="to">
      <IExternalLink width="12" height="12" />
      {{ value || '-' }}
    </RouterLink>
  </td>

  <td v-else-if="variant === 'date'" class="p2 px-4">{{ useDateFormat(value || '', 'DD MMM YYYY').value || '-' }}</td>

  <td v-else-if="variant === 'chip'" class="p2 px-4">
    <Chip :status="chipStatus || false">{{ value || '-' }}</Chip>
  </td>
</template>

<script setup lang="ts">
const { variant = 'text', value } = defineProps<{
  variant?: 'date' | 'text' | 'link' | 'chip'
  chipStatus?: boolean | null
  value: string | number | null
  to?: string
}>()
</script>
