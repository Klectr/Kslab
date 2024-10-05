import { signal, useEffect, useRef } from "kaioken"
import notes from "../signals/notes"
import { Card } from "../types/Card"
import { canvasDimentsion } from "../signals"
import { LayerEnum } from "../utils/enums"

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


      {Object.keys(notes.notes.value).map((noteKey: Card['id']) => {
        const note = notes.notes.value[noteKey]
        return (
          <div
            style={{
              position: 'absolute',
              width: `${note.dimensions.w / _MAP_SCALE_FACTOR}px`,
              height: `${note.dimensions.h / _MAP_SCALE_FACTOR}px`,
              top: `${(note.position.y / _MAP_SCALE_FACTOR)}px`,
              left: `${(note.position.x / _MAP_SCALE_FACTOR)}px`,
              backgroundColor: "#666",
              border: '1px solid #222',
              borderRadius: '2px'
            }}
          ></div>
        )
      })}

      <div style={{
        position: 'absolute',
        width: `${viewportWidth / _MAP_SCALE_FACTOR}px`,
        height: `${viewportHeight / _MAP_SCALE_FACTOR}px`,
        top: `${scrollY.value / _MAP_SCALE_FACTOR}px`,
        left: `${scrollX.value / _MAP_SCALE_FACTOR}px`,
        border: '1px solid #777',
        zIndex: `${LayerEnum.MINIMAP}`,
        backgroundColor: '#fff1',
        borderRadius: '2px'
      }}></div>
    </div >
  )
}

