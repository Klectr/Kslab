import { useRef } from "kaioken"
import { StickyNoteButton } from "./StickyNoteButton"
import { ImageCardButton } from "./ImageCardButton"
import { ExportButton } from "./ExportButton"
import { TextButton } from "./TextButton"
import { ImportButton } from "./ImportButton"

export function CardSelector() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="z-50 flex gap-1 border dark:border-[#3c3c3c] border-[#ddd] rounded-full fixed px-4 dark:bg-[#222] bg-[#eee] top-2 py-1 shadow-md"
      style={{
        left: `${window.innerWidth / 2 - (containerRef.current?.getBoundingClientRect().width ?? 1) / 2}px`
      }}>
      <StickyNoteButton />
      <ImageCardButton />
      <TextButton />

      <Divider />

      <ExportButton />
      <ImportButton />
    </div>
  )
}

function Divider() {
  return (
    <div style={{
      margin: '2px 2px',
      border: "1px solid #9c9c9c",
      borderRight: 'none',
    }}></div>
  )
}






