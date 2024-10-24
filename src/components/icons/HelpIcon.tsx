interface HelpIconProps {
  onMouseOver?: () => void
  onMouseOut?: () => void
}

export function HelpIcon({ onMouseOver, onMouseOut }: HelpIconProps) {

  return (
    <svg
      onmouseout={onMouseOut}
      onmouseover={onMouseOver}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="dark:text-[#5c5c5c] cursor-pointer w-4 h-4 text-[#9c9c9c] hover:text-blue-500 transition-color duration-300"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
      />
      <path
        d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path
        d="M12 17h.01"
      />
    </svg>)
}
