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
      </div>
    </div >

  )
}
