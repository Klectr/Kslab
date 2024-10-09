export function createFileCompliantDateString() {
  return new Date().toDateString().split(" ").join("_")
}
