import { signal, useRef } from "kaioken"
import { TextSignal, focusedItem } from "../signals"
import { useDebounce } from "../utils/useDebounce"
import texts, { TextCardType } from "../signals/texts"
import { LayerEnum } from "../utils/enums"

namespace TextItem {
  export interface TextCardProps {
    key: TextCardType['id']
    data: TextCardType
  }
}

export function TextItem({ key: itemKey, data: item }: TextItem.TextCardProps) {
  const pressed = signal(false)
  const newX = useRef(0)
  const newY = useRef(0)
  const offsetX = useRef(0)
  const offsetY = useRef(0)
  const initialResizeX = useRef(0)

  const { debounce } = useDebounce()

  function updateLocalStorage(time?: number) {
    debounce(() => {
      localStorage.setItem("texts", JSON.stringify(texts.texts.value))
    }, time)
  }

  function _handleMouseMove(e: MouseEvent) {
    e.preventDefault()
    if (!pressed.value) return

    newX.current = e.pageX - offsetX.current
    newY.current = e.pageY - offsetY.current
    const newPos = { x: newX.current, y: newY.current }

    TextSignal.default.updateTextProperty(itemKey, 'position', newPos)
    updateLocalStorage()
  }

  function _handleMouseUp(e: MouseEvent) {
    e.preventDefault()
    pressed.value = false
    window.removeEventListener('mousemove', _handleMouseMove)
    window.removeEventListener('mouseup', _handleMouseUp)
  }

  function _handleMouseDown(e: MouseEvent) {
    focusedItem.value = itemKey
    e.preventDefault()
    e.stopPropagation()
    offsetX.current = e.offsetX
    offsetY.current = e.offsetY
    pressed.value = true
    window.addEventListener('mousemove', _handleMouseMove)
    window.addEventListener('mouseup', _handleMouseUp)
  }

  function _handleResizeMove(e: MouseEvent) {
    const { pageX } = e
    const newX = initialResizeX.current - pageX

    const newW = -newX + item.dimensions.w
    const newDim = { w: newW, h: 0 }

    TextSignal.default.updateTextProperty(itemKey, 'dimensions', newDim)
    TextSignal.default.texts.notify()
  }


  function _handleResizeMouseDown(e: MouseEvent) {
    e.stopPropagation()
    initialResizeX.current = e.pageX
    pressed.value = true
    window.addEventListener('mousemove', _handleResizeMove)
    window.addEventListener('mouseup', _handleResizeMouseUp)
  }

  function _handleResizeMouseUp(_e: MouseEvent) {
    pressed.value = false
    window.removeEventListener('mousemove', _handleResizeMove)
    window.removeEventListener('mouseup', _handleResizeMouseUp)
    updateLocalStorage()
  }

  return (
    <div
      onmousedown={_handleMouseDown}
      className="px-4  transition flex flex-col justify-stretch rounded absolute"
      style={{
        outline: `${focusedItem.value === item.id ? '1px solid' : ''}`,
        fontSize: `${item.dimensions.w / 6}px`,
        zIndex: `${focusedItem.value == itemKey ? LayerEnum.CARD_ELEVATED : LayerEnum.CARD}`,
        top: `${item.position.y}px`,
        left: `${item.position.x}px`,
      }}
    >
      <div className={'select-none drop-shadow relative'}>
        {item.contents}
      </div>



      <ExpandIcon cb={_handleResizeMouseDown} item={item} />
    </div >

  )
}

function ExpandIcon({ cb, item }: {
  cb: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null | undefined,
  item: TextSignal.TextCardType
}) {

  return (
    <svg
      onmousedown={cb}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="h-4 w-4 absolute right-[-6px] bottom-[-6px] cursor-se-resize"
      style={{
        display: focusedItem.value === item.id ? 'unset' : 'none'
      }}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
    </svg>
  )
}
