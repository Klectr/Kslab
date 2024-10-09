import { Editor, Listener } from 'tiny-markdown-editor'
import './md.css'
import { useEffect, useRef } from "kaioken"

namespace MarkDownEditor {
  export interface Props {
    initial: string
    onChange: Listener<'change'>
  }
}

export function MarkDownEditor({ initial, onChange }: MarkDownEditor.Props) {
  const elRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!elRef.current) return
    const editor = new Editor({
      element: elRef.current,
      content: initial
    })
    editor.addEventListener('change', onChange)
  }, [])

  return (
    <div
      className={'h-full overflow-hidden'}
      ref={elRef}
    ></div>
  )
}
