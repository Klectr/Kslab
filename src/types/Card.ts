export type CardTypes = "note" | "image" | "text"
export type positionCoords = { x: number; y: number }
export type dimensionCoords = { w: number; h: number }

type Base64 = string

export interface Card<Ttype extends CardTypes> {
  id: string
  type: Ttype
  title: string
  contents: Ttype extends "image" ? Base64 : string
  position: positionCoords
  dimensions: dimensionCoords
}
