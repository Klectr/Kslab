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
    <div ref={el} style={{
      position: 'fixed',
      backgroundColor: '#ffffff11',
      width: `${width}px`,
      height: `${height}px`,
      translate: `${xPos}px ${yPos}px`,
      zIndex: `${LayerEnum.MINIMAP}`,
      borderRadius: '4px'
    }}>

      {Object.keys(images.images.value).map((imageKey: ImageCardType['id']) => {
        const image = images.images.value[imageKey]

        function _handleItemClick(_e: MouseEvent) {
          window.scrollTo({
            left: image.position.x - ((viewportWidth / 2) - (image.dimensions.w / 2)),
            top: image.position.y - ((viewportHeight / 2) - (image.dimensions.h / 2)),
            behavior: 'smooth'
          })
        }

        return (
          <div className={"bg-green-500 hover:bg-blue-500 cursor-pointer"}
            onclick={_handleItemClick}
            style={{
              position: 'absolute',
              width: `${image.dimensions.w / _MAP_SCALE_FACTOR}px`,
              height: `${image.dimensions.h / _MAP_SCALE_FACTOR}px`,
              top: `${(image.position.y / _MAP_SCALE_FACTOR)}px`,
              left: `${(image.position.x / _MAP_SCALE_FACTOR)}px`,
              border: '1px solid #222',
              borderRadius: '2px',
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
          <div className={"bg-gray-500 hover:bg-blue-500 cursor-pointer"}
            onclick={_handleItemClick}
            style={{
              position: 'absolute',
              width: `${note.dimensions.w / _MAP_SCALE_FACTOR}px`,
              height: `${note.dimensions.h / _MAP_SCALE_FACTOR}px`,
              top: `${(note.position.y / _MAP_SCALE_FACTOR)}px`,
              left: `${(note.position.x / _MAP_SCALE_FACTOR)}px`,
              border: '1px solid #222',
              borderRadius: '2px',
              zIndex: `${LayerEnum.MINIMAP + 1}`
            }}
          ></div>
        )
      })}

      <div
        className={'bg-blue-200 bg-opacity-10'}
        style={{
          position: 'absolute',
          width: `${viewportWidth / _MAP_SCALE_FACTOR}px`,
          height: `${viewportHeight / _MAP_SCALE_FACTOR}px`,
          top: `${scrollY.value / _MAP_SCALE_FACTOR}px`,
          left: `${scrollX.value / _MAP_SCALE_FACTOR}px`,
          border: '1px solid #777',
          zIndex: `${LayerEnum.MINIMAP}`,
          borderRadius: '2px'
        }}></div>
    </div >
  )
}

