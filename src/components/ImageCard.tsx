import { signal, useRef } from "kaioken"
import { ImagesSignal, focusedItem } from "../signals"
import { useDebounce } from "../utils/useDebounce"
import { LayerEnum } from "../utils/enums"
import images, { ImageCardType } from "../signals/images"
import { updateLocalStorage } from "../utils/localStorage"
import { useThemeDetector } from "../utils/useThemeDetector"

namespace ImageCard {
  export interface ImageCardProps {
    key: ImageCardType['id']
    data: ImageCardType
  }
}

export function ImageCard({ key: itemKey, data: item }: ImageCard.ImageCardProps) {
  const { debounce } = useDebounce()
  const pressed = signal(false)
  const newX = useRef(0)
  const newY = useRef(0)
  const offsetX = useRef(0)
  const offsetY = useRef(0)
  const initialResizeX = useRef(0)
  const initialResizeY = useRef(0)

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

  function _handleResizeMove(e: MouseEvent) {
    const { pageX, pageY } = e
    const [newX, newY] = [initialResizeX.current - pageX, initialResizeY.current - pageY]

    const newW = -newX + item.dimensions.w
    const newH = -newY + item.dimensions.h
    const ratio = Math.min(newW / item.dimensions.w, newH / item.dimensions.h)
    const newDim = { w: item.dimensions.w * ratio, h: item.dimensions.h * ratio }

    ImagesSignal.default.updateImageProperty(itemKey, 'dimensions', newDim)
    ImagesSignal.default.images.notify()
  }


  function _handleResizeMouseDown(e: MouseEvent) {
    e.stopPropagation()
    initialResizeX.current = e.pageX
    initialResizeY.current = e.pageY
    pressed.value = true
    window.addEventListener('mousemove', _handleResizeMove)
    window.addEventListener('mouseup', _handleResizeMouseUp)
  }

  function _handleResizeMouseUp() {
    pressed.value = false
    debounceLSUpdate()
    window.removeEventListener('mousemove', _handleResizeMove)
    window.removeEventListener('mouseup', _handleResizeMouseUp)
  }

  return (
    <div
      onmousedown={_handleMouseDown}
      className="select-none transition flex flex-col justify-stretch shadow-md rounded border border-[#1c1c1c] absolute"
      style={{
        zIndex: `${focusedItem.value == itemKey ? LayerEnum.CARD_ELEVATED : LayerEnum.CARD}`,
        top: `${item.position.y}px`,
        left: `${item.position.x}px`,
        width: `${item.dimensions.w}px`,
        height: `${item.dimensions.h}px`,
        backgroundColor: '#181818',
        backgroundImage: `url(${item.contents})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <button className="flex justify-center items-center hover:bg-blue-500 rounded w-5 h-5 dark:text-[#777] dark:hover:text-white text-white text-md absolute right-0 top-0" onclick={(_e: Event) => {
        ImagesSignal.default.removeImage(item.id)
        ImagesSignal.default.images.notify()
        debounceLSUpdate()
      }}>x</button>

      <ExpandIcon cb={_handleResizeMouseDown} />
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
