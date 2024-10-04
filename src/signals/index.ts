import { signal } from "kaioken"

/** this should be an ID of some card/item */
export const focusedItem = signal<string | null>(null)

export * as NotesSigal from "./notes"
