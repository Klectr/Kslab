import { signal } from "kaioken"

/** this should be an ID of some card/item */
export const focusedItem = signal<string | null>(null)
export const canvasDimentsion = signal({ width: 3000, height: 3000 })

export * as NotesSigal from "./notes"
