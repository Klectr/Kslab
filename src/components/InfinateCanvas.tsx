import { useRef, useEffect } from "kaioken"
import { ImagesSignal, NotesSigal, canvasDimentsion } from "../signals"
import { NoteCard } from "./NoteCard"
import notes from "../signals/notes"
import { MiniMap } from "./MiniMap"
import { ImageCard } from "./ImageCard"
import images from "../signals/images"
import { CardSelector } from "./cardSelector/CardSelector"
import { isTheme } from "../utils/isTheme"
import { Logo } from "./Logo"

export default function InfiniteCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo({
      left: (canvasDimentsion.value.width / 2) - (window.innerWidth / 2),
      top: (canvasDimentsion.value.height / 2) - (window.innerHeight / 2)
    })

    const updateDimensions = () => {
      canvasDimentsion.value = {
        width: Math.max(canvasDimentsion.value.width, window.innerWidth),
        height: Math.max(canvasDimentsion.value.height, window.innerHeight),
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    notes.loadLocalStorage()
    images.loadLocalStorage()

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  return (
    <>
      <Logo />
      <CardSelector />
      <MiniMap />

      <div
        className="h-screen w-full absolute top-0 left-0"
      >
        <div
          className="dark:bg-black absolute top-0 left-0"
          ref={containerRef}
          style={{
            width: `${canvasDimentsion.value.width}px`,
            height: `${canvasDimentsion.value.width}px`,
            backgroundSize: "30px 30px",
            backgroundImage: `radial-gradient(circle, rgba(${isTheme('dark') ? '255, 255, 255, 0.2' : '0, 0, 0, 0.2'}) 1px, transparent 1px)`,
          }}>
          {Object.keys(NotesSigal.default.notes.value).map((itemKey: string) => {
            const item = NotesSigal.default.notes.value[itemKey]
            return (
              <NoteCard key={itemKey} data={item} />
            )
          })}

          {Object.keys(ImagesSignal.default.images.value).map((itemKey: string) => {
            const item = ImagesSignal.default.images.value[itemKey]
            return (
              <ImageCard key={itemKey} data={item} />
            )
          })}
        </div>
      </div>
    </>
  )
}
