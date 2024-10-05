import { signal, useRef } from "kaioken"
import { NotesSigal, focusedItem } from "../signals"
import { useDebounce } from "../utils/useDebounce"
import notes, { NoteCardType } from "../signals/notes"
import { LayerEnum } from "../utils/enums"

namespace NoteCard {
  export interface NoteCardProps {
    key: NoteCardType['id']
    data: NoteCardType
  }
}

export function NoteCard({ key: itemKey, data: item }: NoteCard.NoteCardProps) {
  const saved = signal(true)
  const pressed = signal(false)
  const newX = useRef(0)
  const newY = useRef(0)
  const offsetX = useRef(0)
  const offsetY = useRef(0)
  const initialResizeX = useRef(0)
  const initialResizeY = useRef(0)

  const { debounce } = useDebounce()

  function updateLocalStorage(time?: number) {
    debounce(() => {
      localStorage.setItem("notes", JSON.stringify(notes.notes.value))
    }, time)
  }

  function _handleMouseMove(e: MouseEvent) {
    e.preventDefault()
    if (!pressed.value) return

    newX.current = e.pageX - offsetX.current
    newY.current = e.pageY - offsetY.current
    const newPos = { x: newX.current, y: newY.current }

    NotesSigal.default.updateNoteProperty(itemKey, 'position', newPos)
    updateLocalStorage()
  }

  function _handleMouseUp(e: MouseEvent) {
    e.preventDefault()
    pressed.value = false
    window.removeEventListener('mousemove', _handleMouseMove)
    window.removeEventListener('mouseup', _handleMouseUp)
  }

  function _handleMouseDown(e: MouseEvent) {
    e.preventDefault()
    offsetX.current = e.offsetX
    offsetY.current = e.offsetY
    pressed.value = true
    window.addEventListener('mousemove', _handleMouseMove)
    window.addEventListener('mouseup', _handleMouseUp)
  }

  function _handleResizeMove(e: MouseEvent) {
    const { pageX, pageY } = e
    const [newX, newY] = [initialResizeX.current - pageX, initialResizeY.current - pageY]
    NotesSigal.default.updateNoteProperty(itemKey, 'dimensions', { w: -newX + item.dimensions.w, h: -newY + item.dimensions.h })
  }

  function _handleResizeMouseDown(e: MouseEvent) {
    if (pressed.value) return _handleResizeMouseUp()
    initialResizeX.current = e.pageX
    initialResizeY.current = e.pageY
    pressed.value = true
    window.addEventListener('mousemove', _handleResizeMove)
  }

  function _handleResizeMouseUp() {
    pressed.value = false
    window.removeEventListener('mousemove', _handleResizeMove)
  }

  return (
    <div
      onmousedown={() => focusedItem.value = itemKey}
      className="select-none transition flex flex-col justify-stretch shadow-lg rounded border border-[#3c3c3c] absolute"
      style={{
        zIndex: `${focusedItem.value == itemKey ? LayerEnum.CARD_ELEVATED : LayerEnum.CARD}`,
        width: `${item.dimensions.w}px`,
        height: `${item.dimensions.h}px`,
        top: `${item.position.y}px`,
        left: `${item.position.x}px`,
        backgroundColor: '#181818',
      }}
    >
      <div className="flex-1 flex flex-col gap-1">
        <div className="px-2 flex justify-between items-center cursor-move" onmousedown={_handleMouseDown}>
          <div style={{
            opacity: saved.value ? '0' : '100'
          }} className={`rounded-full w-1 h-1 bg-white`}></div>
          <button className="text-md" onclick={(_e: Event) => {
            NotesSigal.default.removeNote(item.id)
            NotesSigal.default.notes.notify()
            updateLocalStorage()
          }}>x</button>
        </div>
        <hr className="border border-[#3c3c3c]" />
        <textarea
          placeholder={"Todo: put some note here"}
          className="flex resize-none px-2 w-full h-full bg-transparent resize-none focus:outline-none text-gray-300"
          value={item.contents}
          onkeypress={() => { saved.value = false }}
          onchange={(e) => {
            NotesSigal.default.updateNoteProperty(itemKey, 'contents', e.target.value)
            NotesSigal.default.notes.notify()
            updateLocalStorage()
            saved.value = true
          }}
        />

        <svg
          onmousedown={_handleResizeMouseDown}
          onmouseup={_handleResizeMouseUp}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#333"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="cursor-[se-resize] absolute right-0 bottom-0 rotate-[225deg]"
        >
          <path d="M2 10v4" />
          <path d="M4 8v8" />
          <path d="M6 5v14" />
        </svg>

      </div>
    </div >

  )
}
