
import { signal, useRef } from "kaioken"
import { NotesSigal, focusedItem } from "../signals"
import { useDebounce } from "../utils/useDebounce"
import notes, { NoteCardType } from "../signals/notes"
import { LayerEnum } from "../utils/enums"
import { useThemeDetector } from "../utils/useThemeDetector"
import { MarkDownEditor } from "./MarkDownEditor/MarkDownEditor"
import { ChangeEvent } from "tiny-markdown-editor"

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

    const newW = -newX + item.dimensions.w
    const newH = -newY + item.dimensions.h
    const newDim = { w: newW, h: newH }

    NotesSigal.default.updateNoteProperty(itemKey, 'dimensions', newDim)
    NotesSigal.default.notes.notify()
  }


  function _handleResizeMouseDown(e: MouseEvent) {
    initialResizeX.current = e.pageX
    initialResizeY.current = e.pageY
    pressed.value = true
    window.addEventListener('mousemove', _handleResizeMove)
    window.addEventListener('mouseup', _handleResizeMouseUp)
  }

  function _handleResizeMouseUp() {
    pressed.value = false
    updateLocalStorage()
    window.removeEventListener('mousemove', _handleResizeMove)
    window.removeEventListener('mouseup', _handleResizeMouseUp)
  }

  function _handleMdChange(e: ChangeEvent) {
    NotesSigal.default.updateNoteProperty(itemKey, 'contents', e.content)
    NotesSigal.default.notes.notify()
    updateLocalStorage()
  }

  return (
    <div
      onmousedown={() => focusedItem.value = itemKey}
      className="overflow-hidden text-[#333] dark:bg-[#1a1a1a] dark:border-[#1c1c1c] bg-[#eee] select-none transition flex flex-col justify-stretch shadow-md rounded border border-[#ddd] absolute"
      style={{
        zIndex: `${focusedItem.value == itemKey ? LayerEnum.CARD_ELEVATED : LayerEnum.CARD}`,
        width: `${item.dimensions.w}px`,
        height: `${item.dimensions.h}px`,
        top: `${item.position.y}px`,
        left: `${item.position.x}px`,
      }}
    >
      <div className="overflow-hidden flex-1 flex flex-col gap-1">
        <div className="px-2 flex justify-between items-center cursor-move" onmousedown={_handleMouseDown}>
          <div style={{
            opacity: saved.value ? '0' : '100'
          }} className={`rounded-full w-1 h-1 dark:bg-white bg-green-500`}></div>
          <button className="text-md dark:text-[#777] text-black" onclick={(_e: Event) => {
            NotesSigal.default.removeNote(item.id)
            NotesSigal.default.notes.notify()
            updateLocalStorage()
          }}>x</button>
        </div>
        <hr className="border dark:border-[#1c1c1c] border-[#ddd]" />

        <MarkDownEditor initial={item.contents} onChange={_handleMdChange} />

        <ExpandIcon cb={_handleResizeMouseDown} />

      </div>
    </div >

  )
}

function ExpandIcon({ cb }: {
  cb: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null | undefined
}) {
  const isDarkTheme = useThemeDetector()

  return (
    <svg
      onmousedown={cb}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={isDarkTheme ? "#777" : "#999"}
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="cursor-[se-resize] absolute right-0 bottom-0 rotate-[225deg]"
    >
      <path d="M2 10v4" />
      <path d="M4 8v8" />
      <path d="M6 5v14" />
    </svg>
  )
}

