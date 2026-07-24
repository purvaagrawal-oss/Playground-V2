export const STORAGE_KEY = 'playground.state.v1'

export function loadPersisted<T>(): Partial<T> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Partial<T>
  } catch {
    return null
  }
}

export function savePersisted(data: unknown): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore quota / serialization errors in the prototype
  }
}

export function clearPersisted(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
