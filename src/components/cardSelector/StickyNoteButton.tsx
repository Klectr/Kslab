import { NotesSigal } from "../../signals"
import notes from "../../signals/notes"
import { updateLocalStorage } from "../../utils/localStorage"

export function StickyNoteButton() {
  function _handleClick(e: MouseEvent) {
    NotesSigal.default.addNote({
      type: "note",
      title: "New Note",
      contents: "",
      position: {
        x: e.pageX - 100,
        y: e.pageY + (window.innerHeight / 2) - 100
      },
      dimensions: {
        w: 200,
        h: 200
      }
    })
    updateLocalStorage("notes", notes.notes.value)
  }

  return (
    <button onclick={_handleClick} className="cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="w-5 h-5 text-[#9c9c9c] hover:text-blue-500  transition-color duration-300">
        <path
          d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
        <path
          d="M15 3v4a2 2 0 0 0 2 2h4" />
      </svg>
    </button>
  )

}
