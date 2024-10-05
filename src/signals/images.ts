import { signal } from "kaioken"
import { Card } from "../types"

export type ImageCardType = Card<"image">

const images = signal<Record<ImageCardType["id"], ImageCardType>>({})

function loadLocalStorage() {
  images.value = JSON.parse(localStorage.getItem("images") ?? "{}")
}

function addImage(data: Omit<ImageCardType, "id">) {
  const newCard = {
    ...data,
    id: crypto.randomUUID(),
  }
  images.value[newCard.id] = newCard
  images.notify()
}

function removeImage(id: ImageCardType["id"]) {
  delete images.value[id]
  images.notify()
}
function updateImageProperty<K extends keyof ImageCardType>(
  id: ImageCardType["id"],
  property: K,
  data: ImageCardType[K]
) {
  const newData = {
    ...images.value[id],
    [property]: data,
  }
  images.value[id] = newData
  images.notify()
}

export default {
  images,
  addImage,
  removeImage,
  updateImageProperty,
  loadLocalStorage,
}
