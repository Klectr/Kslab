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
  const initialResizeY = useRef(0)

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

    TextSignal.default.updateTextProperty(itemKey, 'dimensions', newDim)
    TextSignal.default.texts.notify()
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

  return (
    <div
      onmousedown={_handleMouseDown}
      className="select-none transition flex flex-col justify-stretch rounded border border-[#3c3c3c] absolute border-dashed"
      style={{
        zIndex: `${focusedItem.value == itemKey ? LayerEnum.CARD_ELEVATED : LayerEnum.CARD}`,
        width: `${item.dimensions.w}px`,
        height: `${item.dimensions.h + 100}px`,
        top: `${item.position.y}px`,
        left: `${item.position.x}px`,
      }}
    >
      <div className={'relative w-full h-full'}>
        <p className={'w-full h-full'}>{item.contents}</p>
      </div>
    </div >

  )
}

