import { Signal } from "kaioken"
import { Card, CardTypes } from "../types"

export function updateLocalStorage(
  location: CardTypes,
  collection: Signal<Record<string, Card<CardTypes>>>
) {
  try {
    localStorage.setItem(location, JSON.stringify(collection.value))
  } catch (e) {
    // throw new Error("Could not update local storage")
    throw new DOMException(
      "Could not update local storage",
      "LocalStorageError"
    )
  }
  return collection
}
