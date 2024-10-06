import { ImagesSignal, NotesSigal } from "../../signals"
import { defaultClassName } from "./utils"

export function ExportButton() {

  function _handleExport() {
    const { notes } = NotesSigal.default
    const { images } = ImagesSignal.default

    const mergeState = {
      ...notes.value,
      ...images.value
    }
    const date = new Date().toDateString().split(' ').join('_')
    const name = `Kslab_export_${date}.json`
    const jsonData = JSON.stringify(mergeState)
    const file = new File([jsonData], name, {
      type: 'text/json'
    })
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.download = name
    a.href = url
    a.click()
  }

  return (
    <svg
      onclick={_handleExport}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={defaultClassName}
    >
      <path
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}
