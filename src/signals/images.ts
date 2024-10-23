import { signal } from "kaioken"
import { Card } from "../types"
import { focusedItem } from "."

export type ImageCardType = Card<"images">

const images = signal<Record<ImageCardType["id"], ImageCardType>>({})

function loadLocalStorage() {
  images.value = JSON.parse(localStorage.getItem("images") ?? "{}")
}

function addImage(data: Omit<ImageCardType, "id">) {
  const newCard = {
    ...data,
    id: crypto.randomUUID(),
  }
  console.log("adding image: ", newCard)
  images.value[newCard.id] = newCard
  images.notify()
  focusedItem.value = newCard.id
  return newCard.id
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
