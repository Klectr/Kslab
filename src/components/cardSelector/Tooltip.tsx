export function Tooltip({ children, message }: { children: JSX.Element, message: string }) {
  return (
    <div title={message}
    >
      {children}
    </div>
  )
}
