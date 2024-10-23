export type positionCoords = { x: number; y: number }
export type dimensionCoords = { w: number; h: number }

export enum CardTypes {
  NOTES = "notes",
  IMAGES = "images",
  TEXTS = "texts",
}

type Base64 = string

export interface Card<TCard extends CardTypes> {
  id: string
  type: TCard
  title: string
  contents: TCard extends "image" ? Base64 : string
  position: positionCoords
  dimensions: dimensionCoords
}
