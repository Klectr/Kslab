export type CardTypes = "note" | "image"
export type positionCoords = { x: number; y: number }
export type dimensionCoords = { w: number; h: number }

export interface Card {
  id: string
  type: CardTypes
  title: string
  contents: string
  position: positionCoords
  dimensions: dimensionCoords
}
