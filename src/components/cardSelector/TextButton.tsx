import { Tooltip } from "./Tooltip";
import { TextSignal } from "../../signals";
import texts from "../../signals/texts";
import { updateLocalStorage } from "../../utils/localStorage";
import { defaultClassName } from "./utils";

export function TextButton() {

  function _handleClick(e: MouseEvent) {
    TextSignal.default.addText({
      type: "text",
      title: "New Note",
      contents: "todo: fill me",
      position: {
        x: e.pageX - 100,
        y: e.pageY + (window.innerHeight / 2) - 100
      },
      dimensions: {
        w: 200,
        h: 100
      }
    })
    updateLocalStorage("text", texts.texts.value)
  }

  return (
    <Tooltip message="Create a Text Node">
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
        className={defaultClassName}
      >
        <path d="M4 20h16" />
        <path d="m6 16 6-12 6 12" />
        <path d="M8 12h8" />
      </svg>
    </Tooltip>
    <svg
      onclick={_handleClick}
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
      <path d="M4 20h16" />
      <path d="m6 16 6-12 6 12" />
      <path d="M8 12h8" />
    </svg>
  )
}
