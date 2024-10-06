import { useRef } from "kaioken"
import { StickyNoteButton } from "./StickyNoteButton"
import { ImageCardButton } from "./ImageCardButton"
import { ExportButton } from "./ExportButton"

export function CardSelector() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="z-50 flex gap-1 border border-[#9c9c9c] rounded-full fixed px-4 bg-[#181818] top-2 py-1 shadow-xl"
      style={{
        left: `${window.innerWidth / 2 - (containerRef.current?.getBoundingClientRect().width ?? 1) / 2}px`
      }}>
      <StickyNoteButton />
      <ImageCardButton />
      <Divider />
      <ExportButton />
    </div>
  )
}

function Divider() {
  return (
    <div style={{
      margin: '2px 2px',
      border: "1px solid #9c9c9c",
      borderRight: 'none',
      borderLeft: 'none',
    }}></div>
  )
}






