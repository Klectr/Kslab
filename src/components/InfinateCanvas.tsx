import { useState, useRef, useEffect } from "kaioken"
import { CardSelector } from "./CardSelector"
import { NotesSigal } from "../signals"
import { NoteCard } from "./NoteCard"
import notes from "../signals/notes"

export default function InfiniteCanvas() {
  const [dimensions, setDimensions] = useState({ width: 3000, height: 3000 })
  const containerRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    window.scrollTo({
      left: (dimensions.width / 2) - (window.innerWidth / 2),
      top: (dimensions.height / 2) - (window.innerHeight / 2)
    })

    const updateDimensions = () => {
      setDimensions((prevDimensions) => ({
        width: Math.max(prevDimensions.width, window.innerWidth),
        height: Math.max(prevDimensions.height, window.innerHeight),
      }))
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    notes.loadLocalStorage()


    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  return (
    <>
      <CardSelector />

      <div
        className="h-screen w-full absolute top-0 left-0"
      >
        <div
          className="absolute top-0 left-0"
          ref={containerRef}
          style={{
            width: `${dimensions.width.toString()}px`,
            height: `${dimensions.width.toString()}px`,
            backgroundSize: "30px 30px",
            backgroundImage: "radial-gradient(circle, rgba(255, 255, 255, 0.2) 1px, transparent 1px)",
          }}>
          {Object.keys(NotesSigal.default.notes.value).map((itemKey: string) => {
            const item = NotesSigal.default.notes.value[itemKey]
            return (
              <NoteCard key={itemKey} data={item} />
            )
          })}
        </div>
      </div>
    </>
  )
}
