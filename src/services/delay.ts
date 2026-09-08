/**
 * Utility to simulate realistic database and network latency for demo operations.
 * Slowed down to ensure loaders, spinners, skeletons, and micro-interactions
 * render naturally and remain clearly visible during showcase evaluations.
 */
export function simulateLatency(minMs: number = 650, maxMs: number = 1000): Promise<void> {
  // Enforce a deliberate minimum floor of 500ms so loading states and skeletons are clearly visible
  const effectiveMin = Math.max(500, minMs)
  const effectiveMax = Math.max(effectiveMin + 150, maxMs)
  const ms = Math.floor(Math.random() * (effectiveMax - effectiveMin + 1)) + effectiveMin
  return new Promise((resolve) => setTimeout(resolve, ms))
}

