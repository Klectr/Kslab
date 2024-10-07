import { signal, useEffect, useRef } from "kaioken"
import notes, { NoteCardType } from "../signals/notes"
import { canvasDimentsion } from "../signals"
import { LayerEnum } from "../utils/enums"
import images, { ImageCardType } from "../signals/images"

const _MAP_OFFSET = 20
const _MAP_SCALE_FACTOR = 10
const _defaults = { width: 0, height: 0 }

export function MiniMap() {
  const el = useRef<HTMLDivElement>(null)
  const scrollX = signal(0)
  const scrollY = signal(0)

  const elMeta = el.current?.getBoundingClientRect() ?? _defaults
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const xPos = viewportWidth - elMeta?.width - _MAP_OFFSET
  const yPos = viewportHeight - elMeta.height - _MAP_OFFSET
  const width = canvasDimentsion.value.width / _MAP_SCALE_FACTOR
  const height = canvasDimentsion.value.height / _MAP_SCALE_FACTOR

  useEffect(() => {
    function _handleScroll(_e: Event) {
      scrollX.value = window.scrollX
      scrollY.value = window.scrollY
    }
    window.addEventListener('scroll', _handleScroll)

    return () => window.removeEventListener('scroll', _handleScroll)
  }, [])



  return (
    <div
      className="dark:bg-[#ffffff11] bg-[#0001] fixed rounded"
      ref={el} style={{
        width: `${width}px`,
        height: `${height}px`,
        translate: `${xPos}px ${yPos}px`,
        zIndex: `${LayerEnum.MINIMAP}`,
      }}>

      {Object.keys(images.images.value).map((imageKey: ImageCardType['id']) => {
        const image = images.images.value[imageKey]
        const el = useRef(null)

        function _handleItemClick(_e: MouseEvent) {
          window.scrollTo({
            left: image.position.x - ((viewportWidth / 2) - (image.dimensions.w / 2)),
            top: image.position.y - ((viewportHeight / 2) - (image.dimensions.h / 2)),
            behavior: 'smooth'
          })
        }

        return (
          <div ref={el} className={"absolute dark:bg-green-500 bg-green-300 dark:hover:bg-blue-500 hover:bg-blue-300 cursor-pointer border dark:border-[#222] border-green-500 rounded"}
            onclick={_handleItemClick}
            style={{
              width: `${image.dimensions.w / _MAP_SCALE_FACTOR}px`,
              height: `${image.dimensions.h / _MAP_SCALE_FACTOR}px`,
              top: `${(image.position.y / _MAP_SCALE_FACTOR)}px`,
              left: `${(image.position.x / _MAP_SCALE_FACTOR)}px`,
              zIndex: `${LayerEnum.MINIMAP + 1}`
            }}
          ></div>
        )
      })}


      {Object.keys(notes.notes.value).map((noteKey: NoteCardType['id']) => {
        const note = notes.notes.value[noteKey]

        function _handleItemClick(_e: MouseEvent) {
          window.scrollTo({
            left: note.position.x - ((viewportWidth / 2) - (note.dimensions.w / 2)),
            top: note.position.y - ((viewportHeight / 2) - (note.dimensions.h / 2)),
            behavior: 'smooth'
          })
        }

        return (
          <div className={"absolute dark:bg-gray-500 bg-gray-300 hover:bg-blue-500 cursor-pointer border dark:border-[#222] border-gray-500 rounded"}
            onclick={_handleItemClick}
            style={{
              width: `${note.dimensions.w / _MAP_SCALE_FACTOR}px`,
              height: `${note.dimensions.h / _MAP_SCALE_FACTOR}px`,
              top: `${(note.position.y / _MAP_SCALE_FACTOR)}px`,
              left: `${(note.position.x / _MAP_SCALE_FACTOR)}px`,
              zIndex: `${LayerEnum.MINIMAP + 1}`
            }}
          ></div>
        )
      })}

      <div
        className={'absolute bg-blue-200 bg-opacity-10 border dark:border-blue-800 border-blue-500 bg-blue-500 rounded'}
        style={{
          width: `${viewportWidth / _MAP_SCALE_FACTOR}px`,
          height: `${viewportHeight / _MAP_SCALE_FACTOR}px`,
          top: `${scrollY.value / _MAP_SCALE_FACTOR}px`,
          left: `${scrollX.value / _MAP_SCALE_FACTOR}px`,
          zIndex: `${LayerEnum.MINIMAP * 1000}`,
        }}></div>
    </div >
  )
}

