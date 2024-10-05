import { signal, useRef } from "kaioken"
import { ImagesSignal, focusedItem } from "../signals"
import { useDebounce } from "../utils/useDebounce"
import { LayerEnum } from "../utils/enums"
import images, { ImageCardType } from "../signals/images"
import { updateLocalStorage } from "../utils/localStorage"

namespace ImageCard {
  export interface ImageCardProps {
    key: ImageCardType['id']
    data: ImageCardType
  }
}

export function ImageCard({ key: itemKey, data: item }: ImageCard.ImageCardProps) {
  const pressed = signal(false)
  const newX = useRef(0)
  const newY = useRef(0)
  const offsetX = useRef(0)
  const offsetY = useRef(0)
  const { debounce } = useDebounce()

  function debounceLSUpdate(time?: number) {
    debounce(() => {
      updateLocalStorage("images", images.images.value)
    }, time)
  }

  function _handleMouseMove(e: MouseEvent) {
    e.preventDefault()
    if (!pressed.value) return

    newX.current = e.pageX - offsetX.current
    newY.current = e.pageY - offsetY.current
    const newPos = { x: newX.current, y: newY.current }

    ImagesSignal.default.updateImageProperty(itemKey, 'position', newPos)
    debounceLSUpdate()
  }

  function _handleMouseUp(e: MouseEvent) {
    e.preventDefault()
    pressed.value = false
    window.removeEventListener('mousemove', _handleMouseMove)
    window.removeEventListener('mouseup', _handleMouseUp)
  }

  function _handleMouseDown(e: MouseEvent) {
    e.preventDefault()
    focusedItem.value = itemKey
    offsetX.current = e.offsetX
    offsetY.current = e.offsetY
    pressed.value = true
    window.addEventListener('mousemove', _handleMouseMove)
    window.addEventListener('mouseup', _handleMouseUp)
  }

  return (
    <div
      onmousedown={_handleMouseDown}
      className="select-none transition flex flex-col justify-stretch shadow-lg rounded border border-[#3c3c3c] absolute"
      style={{
        zIndex: `${focusedItem.value == itemKey ? LayerEnum.CARD_ELEVATED : LayerEnum.CARD}`,
        top: `${item.position.y}px`,
        left: `${item.position.x}px`,
        width: `${item.dimensions.w}px`,
        height: `${item.dimensions.h}px`,
        backgroundColor: '#181818'
      }}
    >

      <button className="flex justify-center items-center hover:bg-blue-500 w-5 h-5 text-white text-md absolute right-0 top-0" onclick={(_e: Event) => {
        ImagesSignal.default.removeImage(item.id)
        ImagesSignal.default.images.notify()
        debounceLSUpdate()
      }}>x</button>
      <img
        src={item.contents}
        alt={item.title}
      />
    </div >

  )
}
