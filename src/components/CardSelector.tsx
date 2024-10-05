import { useRef } from "kaioken"
import { ImagesSignal, NotesSigal } from "../signals"
import { updateLocalStorage } from "../utils/localStorage"
import notes from "../signals/notes"
import images from "../signals/images"

export function CardSelector() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="z-50 flex gap-1 border border-[#9c9c9c] rounded-full fixed px-4 bg-[#181818] top-2 py-1 shadow-xl"
      style={{
        left: `${window.innerWidth / 2 - (containerRef.current?.getBoundingClientRect().width ?? 1) / 2}px`
      }}>
      <StickyNote />
      <Image />
    </div>
  )
}

function StickyNote() {
  function _handleClick(e: MouseEvent) {
    NotesSigal.default.addNote({
      type: "note",
      title: "New Note",
      contents: "",
      position: {
        x: e.pageX - 100,
        y: e.pageY + (window.innerHeight / 2) - 100
      },
      dimensions: {
        w: 200,
        h: 200
      }
    })
    updateLocalStorage("notes", notes.notes.value)
  }

  return (
    <button onclick={_handleClick} className="cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="w-5 h-5 text-[#9c9c9c] hover:text-[#ccc] transition-color duration-300">
        <path
          d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
        <path
          d="M15 3v4a2 2 0 0 0 2 2h4" />
      </svg>
    </button>
  )

}

function Image() {
  function _handleClick(mouseEvent: MouseEvent) {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function(readerEvent) {
        let image = document.createElement('img')
        image.onload = function() {
          const { width, height } = image

          // normalize the dimensions so that they fit within a constraint
          const len = Math.sqrt(width * width + height * height)
          const normalizedW = (width / len) * 300
          const normalizedH = (height / len) * 300

          const content = readerEvent.target?.result;
          let img: string = '';
          if (typeof content == 'string') img = content?.split(':')[1]
          if (!img) return

          ImagesSignal.default.addImage({
            type: "image",
            title: "New Image",
            contents: content as string,
            position: {
              x: mouseEvent.pageX - 100,
              y: mouseEvent.pageY + (window.innerHeight / 2) - 100
            },
            dimensions: {
              w: normalizedW,
              h: normalizedH
            }
          })
          updateLocalStorage("images", images.images.value)
        }
        image.src = readerEvent.target?.result as string
      }
    }
    input.click()
  }

  return (
    <button onclick={_handleClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="w-5 h-5 text-[#9c9c9c] hover:text-[#ccc] transition-color duration-300">
        <rect
          width="18"
          height="18"
          x="3"
          y="3"
          rx="2"
          ry="2" />
        <circle
          cx="9"
          cy="9"
          r="2" />
        <path
          d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    </button>
  )
}


