export function createFileFromData(
  data: string,
  name: string,
  type: BlobPropertyBag["type"]
) {
  return new File(Array.from(data), name, {
    type: type,
  })
}
