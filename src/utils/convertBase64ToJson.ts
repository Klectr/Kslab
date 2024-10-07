export function convertBase64ToJson(
  data: string | ArrayBuffer | null | undefined
) {
  try {
    if (!data) throw new Error("no data to decode")
    if (data instanceof ArrayBuffer)
      throw new Error("cannot decode array buffer yet")
    // Decode Base64 to string
    const jsonString = atob(data)

    // Parse string to JSON
    const jsonObject = JSON.parse(jsonString)

    // Display the JSON object
    return jsonObject
  } catch (error) {
    console.error("Error decoding Base64:", error)
  }
}
