import { signal } from "kaioken"
import { Card } from "../types"

const notes = signal<Record<Card["id"], Card>>({})

function loadLocalStorage() {
  notes.value = JSON.parse(localStorage.getItem("notes") ?? "{}")
}

function addNote(data: Omit<Card, "id">) {
  const newCard = {
    ...data,
    id: crypto.randomUUID(),
  }
  notes.value[newCard.id] = newCard
  notes.notify()
  //updateLocalStorage()
}

function removeNote(id: Card["id"]) {
  delete notes.value[id]
  notes.notify()
  //updateLocalStorage()
}
function updateNoteProperty<K extends keyof Card>(
  id: Card["id"],
  property: K,
  data: Card[K]
) {
  const newData = {
    ...notes.value[id],
    [property]: data,
  }
  notes.value[id] = newData
  notes.notify()
  //updateLocalStorage()
}

export default {
  notes,
  addNote,
  removeNote,
  updateNoteProperty,
  //updateLocalStorage,
  loadLocalStorage,
}
