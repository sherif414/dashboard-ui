import { Ref } from 'vue'

export function useLoadingOverlay(
  el: Ref<HTMLElement | null>,
  options: { spinnerThickness?: string; spinnerSize?: string } = {}
) {
  const overlay = document.createElement('div')
  const loadingSpinner = document.createElement('div')
  const isLoading = ref(false)

  loadingSpinner.classList.add('loading')
  loadingSpinner.style.width = options.spinnerSize || '22px'
  loadingSpinner.style.height = options.spinnerSize || '22px'
  loadingSpinner.style.setProperty('--loading-spinner-thickness', options.spinnerThickness || '2px')
  overlay.classList.add('overlay', 'hidden!')

  overlay.appendChild(loadingSpinner)

  onMounted(() => {
    if (!el.value) return
    if (getComputedStyle(el.value).position === 'static') el.value.style.position = 'relative'
    el.value.appendChild(overlay)
  })

  watch(isLoading, () => {
    overlay.classList.toggle('hidden!')
  })

  return {
    isLoading,
  }
}
