import { signal, useRef } from "kaioken"
import { ImagesSignal, focusedItem } from "../signals"
import { useDebounce } from "../utils/useDebounce"
import { LayerEnum } from "../utils/enums"
import images, { ImageCardType } from "../signals/images"

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

  function updateLocalStorage(time?: number) {
    debounce(() => {
      console.log(itemKey, "updated storage")
      localStorage.setItem("images", JSON.stringify(images.images.value))
    }, time)
  }

  function _handleMouseMove(e: MouseEvent) {
    e.preventDefault()
    if (!pressed.value) return

    newX.current = e.pageX - offsetX.current
    newY.current = e.pageY - offsetY.current
    const newPos = { x: newX.current, y: newY.current }

    ImagesSignal.default.updateImageProperty(itemKey, 'position', newPos)
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
        width: `${item.dimensions.w}px`,
        height: `${item.dimensions.h}px`,
        top: `${item.position.y}px`,
        left: `${item.position.x}px`,
        backgroundColor: '#181818'
      }}
    >

      <button className="text-md" onclick={(_e: Event) => {
        ImagesSignal.default.removeImage(item.id)
        ImagesSignal.default.images.notify()
        updateLocalStorage()
      }}>x</button>
      <img
        src={item.contents}
        width={'100%'}
        height={'100%'}
        alt={item.title}
      />
    </div >

  )
}
