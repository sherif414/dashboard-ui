<template>
  <td class="p2 px-4">
    <RouterLink v-if="variant === 'link' && to" class="hover:underline flex gap-2 items-center" :to="to">
      <IExternalLink width="12" height="12" />
      <span>{{ value ?? '-' }}</span>
    </RouterLink>

    <span v-else-if="variant === 'date'">
      {{ formattedDate }}
    </span>

    <Chip v-else-if="variant === 'chip'" :status="chipStatus || false">
      {{ value ?? '-' }}
    </Chip>

    <template v-else>
      {{ value ?? '-' }}
    </template>
  </td>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { IExternalLink } from '~/components/icons'
import Chip from '~/components/Chip.vue'

const props = withDefaults(
  defineProps<{
    variant?: 'date' | 'text' | 'link' | 'chip'
    chipStatus?: boolean | string | null
    value?: string | number | null
    to?: string
  }>(),
  {
    variant: 'text',
    value: null,
  }
)

const formattedDate = computed(() => {
  if (!props.value) return '-'
  const d = new Date(props.value)
  return isNaN(d.getTime()) ? String(props.value) : d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
})
</script>
