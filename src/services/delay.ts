/**
 * Utility to simulate realistic database and network latency for demo operations.
 * Allows loaders, spinners, and micro-interactions to render naturally during showcase.
 */
export function simulateLatency(minMs: number = 200, maxMs: number = 350): Promise<void> {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
  return new Promise((resolve) => setTimeout(resolve, ms))
}
