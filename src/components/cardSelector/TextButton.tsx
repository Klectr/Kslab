import { Tooltip } from "./Tooltip";
import { defaultClassName } from "./utils";

export function TextButton() {

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
  )
}
