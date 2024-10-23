import images, { ImageCardType } from "../../signals/images"
import notes, { NoteCardType } from "../../signals/notes"
import texts, { TextCardType } from "../../signals/texts"
import { Card, CardTypes } from "../../types"
import { convertBase64ToJson } from "../../utils/convertBase64ToJson"
import { updateLocalStorage } from "../../utils/localStorage"
import { Tooltip } from "./Tooltip"
import { defaultClassName } from "./utils"

export function ImportButton() {

  function _handleImport() {
    // guard clause to prevent overwriting existing cards
    if (images.images.value || notes.notes.value) {
      const isConfirmed = confirm("Are you sure you want to overwrite your existing cards?")
      if (!isConfirmed) return
    }

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = ".json"
    input.multiple = false
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function(readerEvent) {
        let content = readerEvent.target?.result;
        // get only the base64 parts and not any identifiers
        content = (content as string).split(',')[1]
        const data: Record<string, Card<CardTypes>> = convertBase64ToJson(content)
        console.log(data)
        for (let key in data) {
          const item = data[key]
          const { id, ...rest } = item
          console.log(id, rest)
          switch (item.type) {
            case CardTypes:
              console.log("adding image: ", rest)
              images.addImage(rest as ImageCardType)
              break;
            case 'notes':
              notes.addNote(rest as NoteCardType)
              break;
            case 'texts':
              texts.addText(rest as TextCardType)
              break;
            default:
              break;
          }
        }

        console.log("images: ", images.images.value)

        updateLocalStorage('notes', notes.notes).notify()
        updateLocalStorage('images', images.images).notify()
        updateLocalStorage('texts', texts.texts).notify()
      }
    }
    input.click()
  }

  return (
    <Tooltip message="Import Json File">
      <svg
        onclick={_handleImport}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className={"rotate-[180deg] " + defaultClassName}
      >
        <path
          d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </svg>
    </Tooltip>
  )
}
