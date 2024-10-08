import { Editor } from 'tiny-markdown-editor'
import './md.css'
import { useEffect, useRef } from "kaioken"

export function MarkDownEditor({ initial }: { initial: string }) {
  const elRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!elRef.current) return
    const editor = new Editor({
      element: elRef.current,
      content: initial
    })
  }, [])

  return (
    <div
      className={'h-full overflow-hidden'}
      ref={elRef}
    ></div>
  )
}
