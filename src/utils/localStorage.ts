import { CardTypes } from "../types"

export function updateLocalStorage(
  location: CardTypes,
  collection: unknown[] | Record<string, unknown>
) {
  localStorage.setItem(location, JSON.stringify(collection))
}
